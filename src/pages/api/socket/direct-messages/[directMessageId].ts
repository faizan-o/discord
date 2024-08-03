import { getCurrentUserProfileInPagesDir } from "@/data/profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";
import { SocketAPIResponse } from "../../../../..";

export default async function handler(
  req: NextApiRequest,
  res: SocketAPIResponse
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(401).json({ error: "Method Not Allowed" });
  }
  try {
    const profile = await getCurrentUserProfileInPagesDir(req);
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    if (!directMessageId)
      return res.status(400).json({ error: "Direct Message ID Missing" });

    if (!conversationId)
      return res.status(400).json({ error: "Conversation ID Missing" });

    const conversation = await db.conversation.findFirst({
      where: {
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation)
      return res.status(404).json({ error: "Conversation Not Found" });

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) return res.status(404).json({ error: "Member Not Found" });

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ error: "Member Not Found" });
    }

    const isMessageOwner = directMessage.member.profileId === profile.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: "You Cannot Modify The Message" });
    }

    if (req.method === "DELETE") {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
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

      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
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

    const updatedMessageKey = `chat:${conversation.id}:messages:update`;
    res?.socket?.server?.io?.emit(updatedMessageKey, directMessage);

    return res.status(200).json(directMessage);
  } catch (err: any) {
    console.log("[MESSAGE_ID]: ", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
