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
import { leaveServer } from "@/actions/member";
import { toast } from "../ui/use-toast";
import { useServerContext } from "../providers/server-provider";

const LeaveServer = () => {
  const { isOpen, onClose, type, data } = useModal();

  const router = useRouter();
  const isModalOpen = isOpen && type === "LeaveServer";

  const [isPending, startTransition] = useTransition();

  const { activeServer } = useServerContext();

  const onLeaveServer = () => {
    startTransition(async () => {
      if (activeServer) {
        const res = await leaveServer({ serverId: activeServer.id });
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
      <DialogContent
        className="bg-transparent border-none w-full h-full"
        isModalDialog
      >
        <DialogTitle className="hidden">Leave Server</DialogTitle>
        <div className="relative">
          <Wrapper
            title={`Leave #${activeServer && activeServer.name}`}
            description={`Are You Sure That You Want To Leave This Server?`}
          >
            <div className="flex justify-between items-center">
              <DialogClose asChild disabled={isPending}>
                <Button>Cancel</Button>
              </DialogClose>
              <Button
                onClick={(e) => onLeaveServer()}
                disabled={isPending}
                variant="destructive"
              >
                Yes, Leave
              </Button>
            </div>
          </Wrapper>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveServer;
