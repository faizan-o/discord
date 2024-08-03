import { getCurrentUserProfileInPagesDir } from "@/data/profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";
import { SocketAPIResponse } from "../../../../..";

export default async function handler(req: NextApiRequest, res: SocketAPIResponse) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(401).json({ error: "Method Not Allowed" });
  }
  try {
    const profile = await getCurrentUserProfileInPagesDir(req);
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { serverId, channelId, messageId } = req.query;
    const { content } = req.body;

    if (!serverId) {
      return res.status(405).json({ error: "Server ID Missing" });
    }

    if (!channelId) {
      return res.status(405).json({ error: "Channel ID Missing" });
    }

    if (!messageId) {
      return res.status(405).json({ error: "Message ID Missing" });
    }

    const server = await db.server.findUnique({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ error: "Server Not Found" });
    }

    const channel = db.channel.findUnique({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({ error: "Channel Not Found" });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return res.status(404).json({ error: "Member Not Found" });
    }

    let message = await db.channelMessage.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Member Not Found" });
    }

    const isMessageOwner = message.member.profileId === profile.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: "You Cannot Modify The Message" });
    }

    if (req.method === "DELETE") {
      message = await db.channelMessage.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          content: "This Message Has Been Deleted",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      message = await db.channelMessage.update({
        where: {
          id: messageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updatedMessageKey = `chat:${channelId}:messages:update`;
    res?.socket?.server?.io?.emit(updatedMessageKey, message);

    return res.status(200).json(message);
  } catch (err: any) {
    console.log("[MESSAGE_ID]: ", err.message)
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
