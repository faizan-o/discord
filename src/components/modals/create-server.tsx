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
import { startTransition, useTransition } from "react";
import { createServer } from "@/actions/server";
import { redirect } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import LoadingButton from "./loading-button";

const CreateServer = () => {
  const form = useForm<z.infer<typeof CreateServerSchema>>({
    resolver: zodResolver(CreateServerSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "CreateServer";

  const imageUrl = form.watch("imageUrl");

  const [isPending, stratTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof CreateServerSchema>) => {
    stratTransition(async () => {
      const server = await createServer(values);
      if (server)
        redirect(`/servers/${server.id}/channels/${server.channels[0].id}`);
    });
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-transparent border-none w-full h-full" isModalDialog>
        <DialogTitle className="hidden">Create Server</DialogTitle>
        <div className="relative">
          <Wrapper
            title="Create Server"
            description="Create A Server To Connect With Your Friend And Enjoy Discord"
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
                        className="cursor-pointer absolute -top-3 -right-3 bg-destructive/75 p-1 rounded-full"
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
                <LoadingButton isPending={isPending} label="Create Server" />
              </form>
            </Form>
          </Wrapper>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServer;
