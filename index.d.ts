import type {
  Member,
  Server,
  Channel,
  Profile,
  Conversation,
  ChannelMessage,
} from "@prisma/client";
import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketServer } from "socket.io";

declare interface ServerActionResponse {
  wasSuccessful: boolean;
  message: string;
}

declare interface MemberWithProfile extends Member {
  profile: Profile;
}

declare interface ChannelMessageWithMemberAndProfile extends ChannelMessage {
  member: MemberWithProfile;
}

declare interface ServerWithChannelAndMembers extends Server {
  adminProfile: Profile;
  members: MemberWithProfile[];
  channels: Channel[];
}

declare interface ConversationWithMemberProfiles extends Conversation {
  memberOne: Member & { profile: Profile };
  memberTwo: Member & { profile: Profile };
}

declare interface SocketAPIResponse extends NextApiResponse {
  socket: Socket & {
    server: NetServer & {
      io: SocketServer;
    };
  };
}
