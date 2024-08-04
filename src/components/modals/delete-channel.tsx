"use client";

import Wrapper from "@/components/modals/wrapper";
import z from "zod";
import { UpdateChannelSchema } from "@/schemas";
import { useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { deleteChannel } from "@/actions/channel";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const DeleteChannel = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "DeleteChannel";

  const [isPending, stratTransition] = useTransition();

  const onDeleteChannel = () => {
    stratTransition(async () => {
      if (data.channel) {
        const res = await deleteChannel({
          channelId: data.channel.id,
        });
        toast({
          title: res.wasSuccessful ? "Success" : "Failure",
          description: res.message,
        });
        if (res.wasSuccessful) {
          window.location.reload();
        }
      }
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent
        className="bg-transparent border-none w-full h-full"
        isModalDialog
      >
        <DialogTitle className="hidden">Update Channel</DialogTitle>
        <div className="relative">
          <Wrapper
            title={`Delete #${data.channel && data.channel.name}`}
            description={`Are You Sure That You Want To Delete The Channel "${
              data.channel && data.channel.name
            }?"`}
          >
            <div className="flex justify-between">
              <DialogClose asChild>
                <Button>Cancel</Button>
              </DialogClose>
              <Button
                disabled={isPending}
                onClick={onDeleteChannel}
                variant="destructive"
              >
                Confirm
              </Button>
            </div>
          </Wrapper>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannel;
