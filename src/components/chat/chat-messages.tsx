import { Member } from "@prisma/client";
import {
  ChannelMessageWithMemberAndProfile,
  MemberWithProfile,
} from "../../..";
import ChatWelcome from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { ScaleLoader } from "react-spinners";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment, useRef, ElementRef } from "react";
import { format } from "date-fns";
import ChatItem from "./chat-item";
import { DATE_FORMAT } from "@/constants";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { Button } from "../ui/button";

interface ChatMessagesProps {
  name: string;
  member: MemberWithProfile;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "Channel" | "Conversation";
}

const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const chatBottomRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      apiUrl,
      paramKey,
      paramValue,
      queryKey,
    });

  useChatSocket({ addKey, updateKey, queryKey });
  useChatScroll({
    chatRef,
    chatBottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  if (status === "pending") {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="flex flex-col justify-center items-center space-y-5">
          <ScaleLoader className="mx-auto" height={17} color="cyan" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Loading Messages
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="flex flex-col justify-center items-center space-y-5">
          <ServerCrash width={100} height={50} color="cyan" />
          <p className="text-sm  text-gray-600 dark:text-gray-400">
            Something Went Wrong
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={chatRef}
      className="flex-1 flex flex-col py-6 px-4 overflow-y-auto"
    >
      {!hasNextPage && (
        <>
          <div className="flex-1" />
          <ChatWelcome name={name} type={type} />
        </>
      )}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 animate-spin text-zinc-500 my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
            >
              Load Previous Messages
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message: ChannelMessageWithMemberAndProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                member={message.member}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                updated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={chatBottomRef} />
    </div>
  );
};

export default ChatMessages;
