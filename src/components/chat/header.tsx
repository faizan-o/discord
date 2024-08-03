"use client";

import { Menu } from "lucide-react";
import { useParams } from "next/navigation";
import { useServerContext } from "../providers/server-provider";
import { ChannelIcon } from "@/lib/map";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import Sidebar from "../navigation/sidebar";
import { useEffect, useState } from "react";
import { Channel, Conversation, Profile } from "@prisma/client";
import { getOrCreateConversation } from "@/actions/conversation";
import { ConversationWithMemberProfiles } from "../../..";
import Image from "next/image";
import SocketIndicator from "../socket-indicator";
import { ScaleLoader } from "react-spinners";
import VideoButton from "../video-button";
import AudioButton from "../audio-button";

const ChatHeader = ({ type }: { type: "Channel" | "Conversation" }) => {
  const ChannelHeader = () => {
    const { activeChannel } = useServerContext();
    if (!activeChannel) return null;
    return (
      <div className="flex items-center space-x-2">
        <ChannelIcon type={activeChannel.type} className="w-5" />
        <h1>{activeChannel.name}</h1>
      </div>
    );
  };

  const ConversationHeader = () => {
    const { activeConversation } = useServerContext();
    const { otherMemberId } = useParams() as {
      otherMemberId: string;
    };
    if (!activeConversation) return <ScaleLoader height={13} color="cyan" />;
    const otherMember =
      activeConversation.memberOneId === otherMemberId
        ? activeConversation.memberOne
        : activeConversation.memberTwo;
    return (
      <div className="flex items-center space-x-2">
        <Image
          src={otherMember.profile.imageUrl}
          alt="Other Member Profile"
          width={1920}
          height={1080}
          className="w-8 rounded-full"
        />
        <h1 className="font-semibold">
          {otherMember && otherMember.profile.name}
        </h1>
      </div>
    );
  };

  return (
    <div className="w-full px-5 flex items-center h-16 dark:bg-zinc-800/5 shadow-xl space-x-4">
      <Sheet>
        <SheetTrigger>
          <Menu className="cursor-pointer block md:hidden" />
        </SheetTrigger>
        <SheetContent className="p-0 border-none" side="left">
          <Sidebar />
        </SheetContent>
      </Sheet>
      <div className="flex items-center justify-between w-full">
        {type === "Channel" && <ChannelHeader />}
        {type === "Conversation" && <ConversationHeader />}
        <div className="flex items-center space-x-2">
          {type === "Conversation" && (
            <div className="flex items-center">
              <VideoButton />
              <AudioButton />
            </div>
          )}
          <SocketIndicator />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
