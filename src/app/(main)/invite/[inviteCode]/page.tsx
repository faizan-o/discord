"use client";

import { addUserToServerByInviteCode } from "@/actions/server";
import Wrapper from "@/components/modals/wrapper";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ScaleLoader } from "react-spinners";

interface InvitedUserPageProps {
  params: {
    inviteCode: string;
  };
}

const InvitedUserPage = ({ params }: InvitedUserPageProps) => {
  const router = useRouter();

  useEffect(() => {
    const addToServerByInviteCode = async () => {
      const response = await addUserToServerByInviteCode(params.inviteCode);
      toast({
        title: response.wasSuccessful ? "Success" : "Failure",
        description: response.message,
      });
      if (response.wasSuccessful && response.serverId && response.channelId) {
        router.push(
          `/servers/${response.serverId}/channels/${response.channelId}`
        );
      }
      if (!response.wasSuccessful) {
        router.push("/");
      }
    };
    addToServerByInviteCode();
  }, [params.inviteCode, router]);
  return (
    <div className="h-full flex justify-center items-center">
      <div className="flex justify-center items-center">
        <Wrapper
          title="Adding You To The Server"
          description="Whose Invite Code You Pasted Into Your Browser"
        >
          <div className="flex justify-center items-center w-full">
            <ScaleLoader height={12} color="white" />
          </div>
        </Wrapper>
      </div>
    </div>
  );
};

export default InvitedUserPage;
