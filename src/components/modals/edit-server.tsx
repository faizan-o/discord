"use client";

import { useForm } from "react-hook-form";
import Wrapper from "@/components/modals/wrapper";
import z from "zod";
import { CreateServerSchema } from "@/schemas";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/custom-form-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldTypes } from "@/types";
import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createServer, updateServerById } from "@/actions/server";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { toast } from "@/components/ui/use-toast";
import LoadingButton from "./loading-button";
import { useRouter } from "next/navigation";
import { useServerContext } from "../providers/server-provider";

const EditServer = () => {
  const { isOpen, onClose, type, data } = useModal();

  const form = useForm<z.infer<typeof CreateServerSchema>>({
    resolver: zodResolver(CreateServerSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const { activeServer } = useServerContext();

  useEffect(() => {
    if (activeServer) {
      form.reset({
        name: activeServer.name,
        imageUrl: activeServer.imageUrl,
      });
    }
  }, [activeServer, form]);

  const isModalOpen = isOpen && type === "EditServer";

  const imageUrl = form.watch("imageUrl");

  const [isPending, stratTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof CreateServerSchema>) => {
    stratTransition(async () => {
      const res = await updateServerById(
        values,
        (activeServer && activeServer.id) || ""
      );
      toast({
        title: res.wasSuccessful ? "Success" : "Failure",
        description: res.message,
      });
    });
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogTrigger className="w-full flex"></DialogTrigger>
      <DialogContent
        className="bg-transparent border-none w-full h-full"
        isModalDialog
      >
        <DialogTitle className="hidden">Create Server</DialogTitle>
        <div className="relative">
          <Wrapper
            title="Edit Server"
            description={`Edit #${activeServer && activeServer.name}`}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {imageUrl.length > 0 ? (
                  <div className="py-5 flex justify-center items-center">
                    <div className="relative">
                      <Image
                        src={imageUrl}
                        alt="Server Image"
                        width={1920}
                        height={1080}
                        className="w-20"
                      />
                      <X
                        onClick={() => form.reset({ imageUrl: "" })}
                        className="cursor-pointer absolute top-0 right-0 bg-destructive/75 p-1 rounded-full"
                      />
                    </div>
                  </div>
                ) : (
                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldTypes.FILE_UPLOADER}
                    label="Server Thumbnail"
                    endpoint="serverImageUploader"
                    disabled={isPending}
                    name="imageUrl"
                  />
                )}
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldTypes.TEXT_INPUT}
                  label="Server Name"
                  disabled={isPending}
                  name="name"
                  placeholder="JohnDoe Server"
                />
                <LoadingButton isPending={isPending} label="Update Server" />
              </form>
            </Form>
          </Wrapper>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditServer;
