"use client";

import {
  ChevronDown,
  FilePenLine,
  LogOut,
  Trash,
  Tv,
  UserPlus,
  UserRoundCog,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { MemberRole, Profile } from "@prisma/client";
import { Separator } from "../../ui/separator";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { useServerContext } from "@/components/providers/server-provider";

const ServerMenu = () => {
  const { currentProfile } = useServerContext();
  const { onOpen } = useModal();

  const { activeServer } = useServerContext();

  const isAdmin =
    currentProfile && activeServer && activeServer.adminProfileId === currentProfile.id;
  const isModerator =
    currentProfile &&
    activeServer &&
    activeServer.members.find((member) => member.profileId === currentProfile.id)
      ?.role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full p-4 shadow-md  dark:shadow-2xl">
        <div className="flex justify-between items-center w-full">
          <h1 className="font-semibold line-clamp-1">
            # {activeServer && activeServer.name}
          </h1>
          <ChevronDown />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {(isAdmin || isModerator) && (
            <>
              <DropdownMenuItem
                className="cursor-pointer pl-4 pr-8 w-full hover:bg-zinc-800 my-1"
                asChild
              >
                <Button
                  className="flex justify-start items-center space-x-3 focus-visible:ring-0 text-blue-500 bg-white hover:invert  dark:bg-black"
                  onClick={() => onOpen("EditServer")}
                >
                  <FilePenLine className="w-4" />
                  <h1 className="text-sm">Edit Server</h1>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer pl-4 pr-8 hover:bg-zinc-800 w-full my-1"
                asChild
              >
                <Button
                  className="flex justify-start items-center space-x-3 focus-visible:ring-0 text-green-500 bg-white hover:invert  dark:bg-black"
                  onClick={() => onOpen("InvitePeople")}
                >
                  <UserPlus className="w-4" />
                  <h1 className="text-sm">Invite People</h1>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer pl-4 pr-8 hover:bg-zinc-800 w-full my-1"
                asChild
              >
                <Button
                  className="flex justify-start items-center space-x-3 focus-visible:ring-0 bg-white text-black hover:invert dark:text-white dark:bg-black"
                  onClick={() => onOpen("CreateChannel")}
                >
                  <Tv className="w-4" />
                  <h1 className="text-sm">Create Channel</h1>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer pl-4 pr-8 hover:bg-zinc-800 w-full my-1"
                asChild
              >
                <Button
                  className="flex justify-start items-center space-x-3 focus-visible:ring-0 bg-white text-black hover:invert dark:text-white dark:bg-black"
                  onClick={() => onOpen("ManageMembers")}
                >
                  <UserRoundCog className="w-4" />
                  <h1 className="text-sm">Manage Members</h1>
                </Button>
              </DropdownMenuItem>
            </>
          )}
          {isAdmin && (
            <DropdownMenuItem
              className="cursor-pointer pl-4 pr-8 w-full hover:bg-zinc-800 my-1"
              asChild
            >
              <Button
                className="flex justify-start items-center space-x-3 focus-visible:ring-0 text-red-500 bg-white hover:invert  dark:bg-black"
                onClick={() => onOpen("DeleteServer")}
              >
                <Trash className="w-4" />
                <h1 className="text-sm">Delete Server</h1>
              </Button>
            </DropdownMenuItem>
          )}
          {!isAdmin && (
            <DropdownMenuItem
              className="cursor-pointer pl-4 pr-8 w-full hover:bg-zinc-800 my-1"
              asChild
            >
              <Button
                className="flex justify-start items-center space-x-3 focus-visible:ring-0 text-red-500 bg-white hover:invert  dark:bg-black"
                onClick={() => onOpen("LeaveServer")}
              >
                <LogOut className="w-4" />
                <h1 className="text-sm">Leave Server</h1>
              </Button>
            </DropdownMenuItem>
          )}
          <Separator />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerMenu;
