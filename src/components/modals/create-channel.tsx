"use client";

import { useForm } from "react-hook-form";
import Wrapper from "@/components/modals/wrapper";
import z from "zod";
import { CreateChannelSchema } from "@/schemas";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/custom-form-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldTypes } from "@/types";
import { useEffect, useTransition } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import LoadingButton from "./loading-button";
import { ChannelType } from "@prisma/client";
import { createChannel } from "@/actions/channel";
import { toast } from "../ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import { useServerContext } from "../providers/server-provider";

const CreateChannel = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "CreateChannel";

  const form = useForm<z.infer<typeof CreateChannelSchema>>({
    resolver: zodResolver(CreateChannelSchema),
    defaultValues: {
      name: "",
      channelType: ChannelType.TEXT,
    },
  });

  useEffect(() => {
    if (data.channelType) {
      form.reset({
        channelType: data.channelType,
      });
    }
  }, [isModalOpen, data, form]);

  const router = useRouter();

  const [isPending, stratTransition] = useTransition();

  const { serverId } = useParams();
  const { activeServer } = useServerContext();

  const onSubmit = (values: z.infer<typeof CreateChannelSchema>) => {
    stratTransition(async () => {
      if (activeServer) {
        const res = await createChannel({
          values,
          serverId: activeServer.id,
        });
        toast({
          title: res.wasSuccessful ? "Success" : "Failure",
          description: res.message,
        });
        if (res.wasSuccessful && res.channelId) {
          router.push(`/servers/${serverId}/channels/${res.channelId}`);
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
        <DialogTitle className="hidden">Create Server</DialogTitle>
        <div className="relative">
          <Wrapper
            title="Create Channel"
            description="Create A Channel To Connect With Your Friend And Enjoy Discord"
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
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldTypes.SELECT}
                  label="Channel Type"
                  disabled={isPending}
                  name="channelType"
                  options={{
                    Text: ChannelType.TEXT,
                    Audio: ChannelType.AUDIO,
                    Video: ChannelType.VIDEO,
                  }}
                />
                <LoadingButton isPending={isPending} label="Create Channel" />
              </form>
            </Form>
          </Wrapper>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannel;
