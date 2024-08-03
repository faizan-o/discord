"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  ConversationWithMemberProfiles,
  ServerWithChannelAndMembers,
} from "../../..";
import { getCurrentUserServers } from "@/data/server";
import { redirect, useParams, usePathname, useRouter } from "next/navigation";
import { Channel, Conversation, Profile } from "@prisma/client";
import { ScaleLoader } from "react-spinners";
import { getOrCreateConversation } from "@/actions/conversation";
import { createOrGetExistingCurrentUserProfile } from "@/actions/profile";

interface ServerContextType {
  servers: ServerWithChannelAndMembers[] | null;
  activeServer: ServerWithChannelAndMembers | null;
  activeChannel: Channel | null;
  activeConversation: ConversationWithMemberProfiles | null;
  currentProfile: Profile | null;
}

const ServerContext = createContext<ServerContextType>({
  servers: null,
  activeServer: null,
  activeChannel: null,
  activeConversation: null,
  currentProfile: null,
});

export const useServerContext = () => useContext(ServerContext);

export const ServerContextProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isFetching, setIsFetching] = useState(true);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [servers, setServers] = useState<ServerWithChannelAndMembers[] | null>(
    null
  );
  const [activeServer, setActiveServer] =
    useState<ServerWithChannelAndMembers | null>(null);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [activeConversation, setActiveConversation] =
    useState<ConversationWithMemberProfiles | null>(null);
  const router = useRouter();

  const pathname = usePathname();
  const { serverId, channelId, otherMemberId } = useParams() as {
    serverId: string;
    channelId: string;
    otherMemberId: string;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const fetchedProfile = await createOrGetExistingCurrentUserProfile();
      setCurrentProfile(fetchedProfile);
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchServers = async () => {
      const fetchedServers = await getCurrentUserServers();
      setServers(fetchedServers);
      if (
        fetchedServers &&
        fetchedServers.length &&
        !pathname?.includes("conversations") &&
        !pathname?.includes("channels")
      )
        router.push(
          `/servers/${fetchedServers[0].id}/channels/${fetchedServers[0].channels[0].id}`
        );
      if (!fetchedServers || fetchedServers.length === 0)
        setTimeout(() => setIsFetching(false), 3000);
    };
    fetchServers();
  }, [router, pathname]);

  useEffect(() => {
    const fetchServer = async () => {
      if (servers) {
        const server =
          servers!.find((server) => server.id === serverId) || null;
        if (!server) router.push("/");
        setActiveServer(server);
      }
      setTimeout(() => setIsFetching(false), 3000);
    };
    if (serverId) {
      fetchServer();
    }
  }, [serverId, router, servers]);

  useEffect(() => {
    if (activeServer && channelId) {
      const channel = activeServer.channels.find(
        (channel) => channel.id === channelId
      );
      setActiveChannel(channel || null);
    }
  }, [activeServer, channelId]);

  useEffect(() => {
    const fetchConversation = async () => {
      const conversation = await getOrCreateConversation({
        otherMemberId,
        serverId: serverId,
      });
      setActiveConversation(conversation);
    };
    if (activeServer && otherMemberId) {
      fetchConversation();
    }
  }, [activeServer, otherMemberId, serverId]);

  if (isFetching) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <ScaleLoader height={15} color="cyan" />
      </div>
    );
  }

  return (
    <ServerContext.Provider
      value={{
        servers,
        activeServer,
        activeChannel,
        activeConversation,
        currentProfile,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};
