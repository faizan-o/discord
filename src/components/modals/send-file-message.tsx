"use client";

import { useForm } from "react-hook-form";
import Wrapper from "@/components/modals/wrapper";
import z from "zod";
import { MessageSchema } from "@/schemas";
import { Form, FormMessage } from "@/components/ui/form";
import CustomFormField from "@/components/custom-form-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldTypes } from "@/types";
import Image from "next/image";
import { File, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import LoadingButton from "./loading-button";
import qs from "query-string";
import axios from "axios";
import { ClientUploadedFileData } from "uploadthing/types";

const SendFileMessage = () => {
  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      content: "",
      fileUrl: "",
    },
  });

  const {
    isOpen,
    onClose,
    type,
    data: { apiUrl, query },
  } = useModal();
  const isModalOpen = isOpen && type === "SendFileMessage";

  const imageUrl = form.watch("fileUrl");

  const [isPending, startTransition] = useTransition();
  const [fileData, setFileData] = useState<ClientUploadedFileData<null> | null>(
    null
  );

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = (values: z.infer<typeof MessageSchema>) => {
    startTransition(async () => {
      const url = qs.stringifyUrl({ url: apiUrl!, query: query! });
      await axios.post(url, values);
      form.reset();
      setFileData(null);
      handleClose();
    });
  };

  useEffect(() => {
    form.reset({
      fileUrl: imageUrl,
      content: fileData?.name,
    });
  }, [imageUrl, fileData]);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-transparent border-none w-full h-full">
        <DialogTitle className="hidden">Send File</DialogTitle>
        <div className="relative">
          <Wrapper
            title="Send File"
            description="Send Images Or PDFs To Your Friends By Uplaoding And Hitting Send"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {fileData ? (
                  <div className="pt-3 flex justify-center items-center">
                    <div className="relative">
                      {fileData && fileData.type.startsWith("image/") && (
                        <>
                          <Image
                            src={imageUrl}
                            alt="Server Image"
                            width={1920}
                            height={1080}
                            className="w-full"
                          />
                          <p className="my-4 rounded-md py-3 bg-gray-800 px-[8px] text-sm text-center">
                            {imageUrl}
                          </p>
                        </>
                      )}
                      {fileData && !fileData.type.startsWith("image/") && (
                        <>
                          <div className="flex justify-center items-center">
                            <Image
                              src={"/file_icon.webp"}
                              alt="Server Image"
                              width={1920}
                              height={1080}
                              className="w-7/12"
                            />
                          </div>
                          <p className="my-4 rounded-md py-3 bg-gray-800 px-[8px] text-sm text-center">
                            {imageUrl}
                          </p>
                        </>
                      )}
                      <X
                        onClick={() => {
                          startTransition(() => {
                            form.reset({ fileUrl: "" });
                            setFileData(null);
                          });
                        }}
                        className="cursor-pointer absolute -top-3 -right-3 bg-destructive/75 p-1 rounded-full"
                      />
                    </div>
                  </div>
                ) : (
                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldTypes.FILE_UPLOADER}
                    endpoint="messageImageUploader"
                    label="File To Send"
                    setFileData={setFileData}
                    disabled={isPending}
                    name="fileUrl"
                  />
                )}
                <LoadingButton isPending={isPending} label="Send Message" />
              </form>
            </Form>
          </Wrapper>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendFileMessage;
