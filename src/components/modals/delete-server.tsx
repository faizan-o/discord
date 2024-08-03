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
import { deleteServer } from "@/actions/server";
import { useServerContext } from "../providers/server-provider";

const DeleteServer = () => {
  const { isOpen, onClose, type, data } = useModal();

  const router = useRouter();
  const isModalOpen = isOpen && type === "DeleteServer";

  const [isPending, startTransition] = useTransition();

  const {activeServer} = useServerContext()

  const onDeleteServer = () => {
    startTransition(async () => {
      if (activeServer) {
        const res = await deleteServer({ serverId: activeServer.id });
        toast({
          title: res.wasSuccessful ? "Success" : "Failure",
          description: res.message,
        });
        onClose();
        if (res.wasSuccessful) router.push("/");
      }
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogTrigger className="w-full flex"></DialogTrigger>
      <DialogContent className="bg-transparent border-none w-full h-full">
        <DialogTitle className="hidden">Leave Server</DialogTitle>
        <div className="relative">
          <Wrapper
            title={`Delete #${activeServer && activeServer.name}`}
            description={`Are You Sure That You Want To Delete This Server?`}
          >
            <div className="flex justify-between items-center">
              <DialogClose asChild disabled={isPending}>
                <Button>Cancel</Button>
              </DialogClose>
              <Button
                onClick={(e) => onDeleteServer()}
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

export default DeleteServer;
