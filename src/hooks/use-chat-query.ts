import { useSocketContext } from "@/components/providers/socket-provider";
import { getFirstMessageId } from "@/data/messageId";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: string;
  paramValue: string;
}

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) => {
  const { isConnected } = useSocketContext();

  const fetchMessages = async ({ pageParam }: { pageParam: any }) => {
    let messageId = null;
    if (!pageParam) {
      messageId = await getFirstMessageId({
        [paramKey]: paramValue,
      });
    }
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor:  messageId || pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    );
    const res = await fetch(url);

    return res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
      initialPageParam: undefined,
    });

  return { data, fetchNextPage, hasNextPage, isFetchingNextPage, status };
};
