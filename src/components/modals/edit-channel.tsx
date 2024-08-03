"use client";

import { useForm } from "react-hook-form";
import Wrapper from "@/components/modals/wrapper";
import z from "zod";
import { CreateChannelSchema, UpdateChannelSchema } from "@/schemas";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/custom-form-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldTypes } from "@/types";
import { useEffect, useTransition } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import LoadingButton from "./loading-button";
import { ChannelType } from "@prisma/client";
import { createChannel, updateChannel } from "@/actions/channel";
import { toast } from "../ui/use-toast";
import { useParams, useRouter } from "next/navigation";

const EditChannel = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "EditChannel";

  const form = useForm<z.infer<typeof UpdateChannelSchema>>({
    resolver: zodResolver(UpdateChannelSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (data.channel) {
      form.reset({
        name: data.channel.name,
      });
    }
  }, [isModalOpen, data]);

  const [isPending, stratTransition] = useTransition();

  const onSubmit = (values: z.infer<typeof UpdateChannelSchema>) => {
    stratTransition(async () => {
      if (data.channel) {
        const res = await updateChannel({
          values,
          channelId: data.channel.id,
        });
        toast({
          title: res.wasSuccessful ? "Success" : "Failure",
          description: res.message,
        });
        if (res.wasSuccessful && res.channelId) {
          window.location.reload();
        }
      }
    });
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-transparent border-none w-full h-full">
        <DialogTitle className="hidden">Update Channel</DialogTitle>
        <div className="relative">
          <Wrapper
            title="Edit Channel"
            description="Edit The Channel's Info To Stand Out Form The Crowd"
          >
            <Form {...form}>
              <form
                className="space-y-5"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldTypes.TEXT_INPUT}
                  label="Channel Name"
                  disabled={isPending}
                  name="name"
                  placeholder="Your Channel Name"
                />
                <LoadingButton isPending={isPending} label="Update Channel" />
              </form>
            </Form>
          </Wrapper>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditChannel;
