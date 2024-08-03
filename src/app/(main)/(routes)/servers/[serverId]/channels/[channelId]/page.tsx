"use client";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import ChatHeader from "@/components/chat/header";
import { useServerContext } from "@/components/providers/server-provider";
import { getCurrentMember } from "@/data/member";
import { ChannelType, Member } from "@prisma/client";
import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { MemberWithProfile } from "../../../../../../../..";
import { channel } from "diagnostics_channel";
import { MessageCircle } from "lucide-react";
import MediaRoom from "@/components/media-room";

const ChannelPage = () => {
  const { activeChannel, activeServer } = useServerContext();
  const [member, setMember] = useState<MemberWithProfile | null>(null);
  useEffect(() => {
    const fetchMember = async () => {
      if (activeServer) {
        const member = await getCurrentMember(activeServer.id);
        setMember(member);
      }
    };

    fetchMember();
  });

  if (!activeChannel)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <ScaleLoader height={13} color="cyan" />
      </div>
    );

  return (
    <div className="z-10 flex flex-col min-h-full max-h-full relative">
      <div className="-z-10 absolute w-full h-full top-0 left-0 flex justify-center items-center">
        <div className="w-full h-full bg-clip-text text-transparent">
          <MessageCircle
            strokeWidth={1}
            className="w-full h-full mb-10 text-zinc-700"
            style={{ opacity: 0.3 }}
          />
        </div>
      </div>
      <div>
        <ChatHeader type="Channel" />
      </div>
      {activeChannel.type === ChannelType.TEXT && (
        <>
          {member && (
            <ChatMessages
              name={activeChannel.name}
              chatId={activeChannel.id}
              member={member}
              type="Channel"
              apiUrl="/api/messages/"
              socketUrl="/api/socket/messages"
              socketQuery={{
                channelId: activeChannel.id,
                serverId: activeServer!.id,
              }}
              paramKey="channelId"
              paramValue={activeChannel.id}
            />
          )}
          <ChatInput
            name={activeChannel.name}
            type="Channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: activeChannel!.id,
              serverId: activeServer!.id,
            }}
          />
        </>
      )}
      {activeChannel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={activeChannel.id} audio={true} video={false} />
      )}
      {activeChannel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={activeChannel.id} audio={false} video={true} />
      )}
    </div>
  );
};

export default ChannelPage;
