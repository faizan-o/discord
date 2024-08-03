"use client";

import { Plus } from "lucide-react";
import { Separator } from "../ui/separator";
import ActionToolTip from "../action-tooltip";
import { useEffect, useState } from "react";
import { Server } from "@prisma/client";
import { getCurrentUserServers } from "@/data/server";
import Link from "next/link";
import Image from "next/image";
import CustomUserButton from "../user-button";
import { ModeToggle } from "../mode-toogle";
import { useParams } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { ServerWithChannelAndMembers } from "../../..";
import { useServerContext } from "../providers/server-provider";
import { cn } from "@/lib/utils";

const ServerSidebar = () => {
  const { onOpen } = useModal();

  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "g" && (e.metaKey || e.altKey)) {
        e.preventDefault();
        onOpen("SearchModal");
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onOpen]);

  const { servers, activeServer } = useServerContext();

  return (
    <div className="w-[70px] py-4 bg-gray-600/25  dark:bg-zinc-900 h-full flex flex-col justify-between items-center">
      <div className="flex flex-col justify-center items-center space-y-5">
        <ActionToolTip label="Create A Server" side="right">
          <div
            onClick={(e) => onOpen("CreateServer")}
            className="mx-auto text-emerald-600 p-[0.75rem] w-12 h-12 flex justify-center items-center rounded-full bg-gray-500/25"
          >
            <Plus />
          </div>
        </ActionToolTip>
        <Separator className="w-10 h-[2px]" />
        {servers &&
          servers.map((server) => (
            <Link
              key={server.id}
              href={`/servers/${server.id}/channels/${
                server.channels?.find((channel) => channel.name === "General")
                  ?.id
              }`}
            >
              <ActionToolTip side="right" label={server.name}>
                <div className="relative flex justify-center items-center">
                  <div className="w-14 h-14 rounded-full flex justify-center items-center">
                    <div className="w-10 h-10 flex justify-center items-center">
                      <Image
                        src={server.imageUrl}
                        alt="Server Image"
                        width={1920}
                        height={1080}
                        className={cn(
                          "w-full h-full object-center object-cover rounded-full border-gray-900 dark:border-gray-300 border-2",
                          {
                            "rounded-2xl":
                              activeServer && server.id === activeServer.id,
                          }
                        )}
                      />
                    </div>
                    {activeServer && server.id === activeServer.id && (
                      <div className="absolute left-0 top-0 w-1 rounded-r-xl h-full bg-white" />
                    )}
                  </div>
                </div>
              </ActionToolTip>
            </Link>
          ))}
      </div>
      <div className="flex flex-col space-y-5 justify-center items-center">
        <ActionToolTip side="right" label="Change Theme">
          <ModeToggle />
        </ActionToolTip>
        <ActionToolTip side="right" label="User Settings">
          <CustomUserButton />
        </ActionToolTip>
      </div>
    </div>
  );
};

export default ServerSidebar;
