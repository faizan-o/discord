"use client";

import Wrapper from "@/components/modals/wrapper";
import { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import useOrigin from "@/hooks/use-origin";
import { CheckCircle, Clipboard } from "lucide-react";
import { Button } from "../ui/button";
import { generateNewInviteCode } from "@/actions/server";
import { toast } from "../ui/use-toast";
import { useServerContext } from "../providers/server-provider";

const InvitePeople = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "InvitePeople";

  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  const [inviteCode, setInviteCode] = useState<string>("");

  const { activeServer } = useServerContext();

  useEffect(() => {
    if (activeServer) {
      setInviteCode(activeServer.inviteCode);
    }
  }, [activeServer]);

  const origin = useOrigin();
  const fullInviteCode = activeServer && `${origin}/invite/${inviteCode}`;

  const copyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullInviteCode!);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const generateInviteCode = () => {
    startTransition(async () => {
      const res = await generateNewInviteCode(activeServer!.id);
      toast({
        title: !!res ? "Success" : "Failure",
        description: !!res
          ? "Generated The New Code Successfully"
          : "Something Went Wrong",
      });
      if (res) setInviteCode(res);
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-transparent border-none w-full h-full">
        <DialogTitle className="hidden">Invite People</DialogTitle>
        <div className="relative">
          <Wrapper
            title="Invite People"
            description={`Invite People To Your Server By Sharing The Link Below`}
          >
            <h1 className="text-sm">Share This Link With Friends</h1>
            <div className="flex items-center pt-4 space-x-1">
              <div className="bg-zinc-800 rounded-md text-sm">
                <p className="p-2 text-gray-300 line-clamp-2">
                  {fullInviteCode}
                </p>
              </div>
              <div className="flex-end cursor-pointer" onClick={copyLink}>
                <Button className="h-full py-4" disabled={isPending}>
                  {copied ? <CheckCircle /> : <Clipboard />}
                </Button>
              </div>
            </div>
            <div onClick={generateInviteCode}>
              <Button type="button" className="px-0 py-5" variant="link">
                Generate A New Link
              </Button>
            </div>
          </Wrapper>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvitePeople;
