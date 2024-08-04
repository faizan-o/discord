"use client";

import Wrapper from "@/components/modals/wrapper";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import { useServerContext } from "../providers/server-provider";
import qs from "query-string";
import axios from "axios";

const DeleteMessage = () => {
  const {
    isOpen,
    onClose,
    type,
    data: { apiUrl, query },
  } = useModal();

  const router = useRouter();
  const isModalOpen = isOpen && type === "DeleteMessage";

  const [isPending, startTransition] = useTransition();

  const { activeServer } = useServerContext();

  const onDeleteMessage = () => {
    startTransition(async () => {
      if (activeServer) {
        const url = qs.stringifyUrl({
          url: apiUrl as string,
          query,
        });

        const res = await axios.delete(url);
        const success = res.status === 200;
        toast({
          title: success ? "Success" : "Failure",
          description: success
            ? "Permanently Deleted The Message"
            : "Something Went Wrong",
        });
        onClose();
      }
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogTrigger className="w-full flex"></DialogTrigger>
      <DialogContent
        className="bg-transparent border-none w-full h-full"
        isModalDialog
      >
        <DialogTitle className="hidden">Delete Message</DialogTitle>
        <div className="relative">
          <Wrapper
            title="Delete Message"
            description="Are You Sure That You Want To Delete This Server? This Message Will Be Permanaently Deleted"
          >
            <div className="flex justify-between items-center">
              <DialogClose asChild disabled={isPending}>
                <Button>Cancel</Button>
              </DialogClose>
              <Button
                onClick={(e) => onDeleteMessage()}
                disabled={isPending}
                variant="destructive"
              >
                Yes, Delete
              </Button>
            </div>
          </Wrapper>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMessage;
