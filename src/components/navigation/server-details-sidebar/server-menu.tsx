"use client";

import {
  ChevronDown,
  FilePenLine,
  LogOut,
  Trash,
  Tv,
  UserPlus,
  UserRoundCog,
  type LucideIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { MemberRole } from "@prisma/client";
import { Separator } from "../../ui/separator";
import { Button } from "../../ui/button";
import { ModalType, useModal } from "@/hooks/use-modal-store";
import { useServerContext } from "@/components/providers/server-provider";
import { cn } from "@/lib/utils";

const ServerMenu = () => {
  const { currentProfile } = useServerContext();
  const { onOpen } = useModal();

  const { activeServer } = useServerContext();

  const isAdmin =
    currentProfile &&
    activeServer &&
    activeServer.adminProfileId === currentProfile.id;
  const isModerator =
    currentProfile &&
    activeServer &&
    activeServer.members.find(
      (member) => member.profileId === currentProfile.id
    )?.role === MemberRole.MODERATOR;

  const MenuItem = ({
    Icon,
    modalType,
    label,
    buttonClassName,
  }: {
    Icon: LucideIcon;
    modalType: ModalType;
    label: string;
    buttonClassName?: string;
  }) => (
    <DropdownMenuItem className="cursor-pointer pl-4 pr-8 py-2 w-full hover:bg-transparent bg-transparent" asChild>
      <Button
        className={cn(
          "flex justify-start items-center space-x-3 focus-visible:ring-0 text-black dark:text-white bg-white dark:bg-[#1e1e22] dark:hover:bg-black rounded-none",
          buttonClassName
        )}
        onClick={() => onOpen(modalType)}
      >
        <Icon className="w-4" />
        <h1 className="text-sm">{label}</h1>
      </Button>
    </DropdownMenuItem>
  );

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
      <DropdownMenuContent className="bg-transparent">
        <DropdownMenuGroup>
          {(isAdmin || isModerator) && (
            <>
              <MenuItem
                Icon={FilePenLine}
                modalType="EditServer"
                label="Edit Server"
                buttonClassName="text-blue-500 dark:text-blue-500"
              />
              <MenuItem
                Icon={UserPlus}
                modalType="InvitePeople"
                label="Invite People"
                buttonClassName="text-green-500 dark:text-green-500"
              />
              <MenuItem
                Icon={Tv}
                modalType="CreateChannel"
                label="Create Channel"
              />
              <MenuItem
                Icon={UserRoundCog}
                modalType="ManageMembers"
                label="Manage Members"
              />
            </>
          )}
          {isAdmin && (
            <>
              <MenuItem
                Icon={Trash}
                modalType="DeleteServer"
                label="Delete Server"
                buttonClassName="text-rose-500 dark:text-rose-500"
              />
            </>
          )}
          {!isAdmin && (
            <>
              <MenuItem
                Icon={LogOut}
                modalType="LeaveServer"
                label="Leave Server"
                buttonClassName="text-rose-500 dark:text-rose-500"
              />
            </>
          )}
          <Separator />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerMenu;
