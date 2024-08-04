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
import Image from "next/image";
import { MemberRole, type Profile } from "@prisma/client";
import {
  Ban,
  EllipsisVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldHalf,
  User,
} from "lucide-react";
import ActionToolTip from "../action-tooltip";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ScaleLoader } from "react-spinners";
import { kickMember, makeMemberMoerator } from "@/actions/member";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useServerContext } from "../providers/server-provider";

interface UserProfileProps {
  id: string;
  profile: Profile;
  role: MemberRole;
}

const ManageMembers = () => {
  const {
    isOpen,
    onClose,
    type,
  } = useModal();

  const isModalOpen = isOpen && type === "ManageMembers";

  const [isPending, startTransition] = useTransition();

  const { activeServer } = useServerContext();

  const handleClose = () => {
    onClose();
  };

  const onMemberKicked = (memberId: string) => {
    startTransition(async () => {
      const res = await kickMember({ serverId: activeServer!.id, memberId });
      toast({
        title: res.wasSuccessful ? "Success" : "Failure",
        description: res.message,
      });
      if (res.wasSuccessful) window.location.reload();
    });
  };

  const onMakeMemberModerator = (memberId: string) => {
    startTransition(async () => {
      const res = await makeMemberMoerator({ serverId: activeServer!.id, memberId });
      toast({
        title: res.wasSuccessful ? "Success" : "Failure",
        description: res.message,
      });
      if (res.wasSuccessful) window.location.reload();
    });
  };

  const onMakeMemberGuest = (memberId: string) => {
    startTransition(async () => {
      const res = await makeMemberMoerator({ serverId: activeServer!.id, memberId });
      toast({
        title: res.wasSuccessful ? "Success" : "Failure",
        description: res.message,
      });
      if (res.wasSuccessful) window.location.reload();
    });
  };

  const UserProfile = ({ profile, role, id }: UserProfileProps) => {
    return (
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-7">
          <div className="relative w-fit">
            <Image
              src={profile.imageUrl}
              alt={`${profile.name} Avatar`}
              width={1920}
              height={1080}
              className="w-10 h-10 rounded-full"
            />
            {role === MemberRole.ADMIN && (
              <ActionToolTip side="top" label="Admin">
                <ShieldCheck className="text-emerald-500 absolute -top-3 -right-3 w-4" />
              </ActionToolTip>
            )}
            {role === MemberRole.MODERATOR && (
              <ActionToolTip side="top" label="Moderator">
                <ShieldHalf className="text-red-500 absolute -top-3 -right-3 w-4" />
              </ActionToolTip>
            )}
            {role === MemberRole.GUEST && (
              <ActionToolTip side="top" label="Guest">
                <User className="text-blue-500 absolute -top-3 -right-3 w-4" />
              </ActionToolTip>
            )}
          </div>
          <h1 className="line-clamp-1 font-semibold">{profile.name}</h1>
        </div>
        <div className="flex space-x-1 items-center">
          <p
            className={cn(
              "p-2 rounded-md w-fit text-xs text-green-500 border-green-500 border-[1px]",
              {
                "text-red-500 border-red-500": role === MemberRole.ADMIN,
                "text-blue-500 border-blue-500": role === MemberRole.MODERATOR,
              }
            )}
          >
            {role}
          </p>
          {role !== MemberRole.ADMIN && (
            <DropdownMenu>
              <DropdownMenuTrigger disabled={isPending}>
                <div>
                  <EllipsisVertical />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="px-1" >
                {role === MemberRole.MODERATOR && (
                  <DropdownMenuItem className="w-full" asChild>
                    <Button
                      onClick={(e) => onMakeMemberGuest(id)}
                      className="invert cursor-pointer flex justify-start items-center space-x-2"
                    >
                      <ShieldAlert className="w-4 text-green-500 invert" />
                      <span>Make Guest</span>
                    </Button>
                  </DropdownMenuItem>
                )}
                {role === MemberRole.GUEST && (
                  <DropdownMenuItem className="w-full" asChild>
                    <Button
                      onClick={(e) => onMakeMemberModerator(id)}
                      className="invert cursor-pointer flex justify-start items-center space-x-2"
                    >
                      <ShieldAlert className="w-4 text-green-500 invert" />
                      <span>Make Moderator</span>
                    </Button>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="w-full" asChild>
                  <Button
                    onClick={(e) => onMemberKicked(id)}
                    className="invert cursor-pointer flex justify-start items-center space-x-2"
                  >
                    <Ban className=" w-4 text-red-500 invert" />
                    <span> Kick Out</span>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent
        className="bg-transparent border-none w-full h-full"
        isModalDialog
      >
        <DialogTitle className="hidden">Manage Members</DialogTitle>
        <div className="relative">
          <Wrapper
            title="Manage Members"
            description="Manage The Members Of Your Server By Controlling Their Role And Access"
          >
            <div>
              <div className="flex flex-col space-y-5 py-5 max-h-[500px] overflow-y-auto relative">
                <ScaleLoader
                  loading={isPending}
                  height={13}
                  color="cyan"
                  className="absolute top-2 right-2"
                />
                <h1 className="font-bold">Admin</h1>
                {activeServer && (
                  <UserProfile
                    profile={activeServer.adminProfile}
                    id={activeServer.adminProfileId}
                    role={MemberRole.ADMIN}
                  />
                )}
                <h1 className="font-bold">
                  Members of {activeServer && activeServer.name}
                </h1>
                {activeServer &&
                  activeServer.members
                    .filter(
                      (member) =>
                        member.profile.id !== activeServer.adminProfileId
                    )
                    .map(({ profile, id, role }) => (
                      <UserProfile
                        profile={profile}
                        key={id}
                        id={id}
                        role={role}
                      />
                    ))}
              </div>
              {(!activeServer ||
                activeServer.members.filter(
                  (member) => member.profileId !== activeServer.adminProfileId
                ).length === 0) && (
                <p className="text-gray-500 text-sm text-center">
                  There Are No Members
                </p>
              )}
            </div>
          </Wrapper>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageMembers;
