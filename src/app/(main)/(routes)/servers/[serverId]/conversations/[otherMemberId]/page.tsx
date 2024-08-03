"use client";

import ChatInput from "@/components/chat/chat-input";
import ChatHeader from "@/components/chat/header";
import { getCurrentMember } from "@/data/member";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { MemberWithProfile } from "../../../../../../../..";
import { useServerContext } from "@/components/providers/server-provider";
import { ScaleLoader } from "react-spinners";
import ChatMessages from "@/components/chat/chat-messages";
import MediaRoom from "@/components/media-room";

const ConversationsPage = ({
  searchParams: { video, audio },
}: {
  searchParams: {
    video?: boolean;
    audio?: boolean;
  };
}) => {
  const { activeConversation, activeServer } = useServerContext();
  const [currentMember, setCurrentMember] = useState<MemberWithProfile | null>(
    null
  );
  useEffect(() => {
    const fetchMember = async () => {
      if (activeServer) {
        const member = await getCurrentMember(activeServer.id);
        setCurrentMember(member);
      }
    };

    fetchMember();
  });

  if (!activeConversation)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <ScaleLoader height={13} color="cyan" />
      </div>
    );

  const otherMember =
    currentMember && currentMember.id === activeConversation?.memberOneId
      ? activeConversation.memberTwo
      : activeConversation.memberOne;

  return (
    <div className="dark:bg-[#313338] flex flex-col h-full">
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
          <ChatHeader type="Conversation" />
        </div>
        {!video && !audio && (
          <>
            {currentMember && (
              <ChatMessages
                member={currentMember}
                name={otherMember.profile.name}
                chatId={activeConversation.id}
                type="Conversation"
                apiUrl="/api/direct-messages/"
                socketUrl="/api/socket/direct-messages"
                socketQuery={{
                  conversationId: activeConversation.id,
                }}
                paramKey="conversationId"
                paramValue={activeConversation.id}
              />
            )}
            <ChatInput
              name={otherMember.profile.name}
              type="Conversation"
              apiUrl="/api/socket/direct-messages"
              query={{
                conversationId: activeConversation.id,
              }}
            />
          </>
        )}
        {video && !audio && (
          <MediaRoom
            chatId={activeConversation.id}
            video={true}
            audio={false}
          />
        )}
        {!video && audio && (
          <MediaRoom
            chatId={activeConversation.id}
            video={false}
            audio={true}
          />
        )}
      </div>
    </div>
  );
};

export default ConversationsPage;
