import { getCurrentUserProfileInPagesDir } from "@/data/profile";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";
import { SocketAPIResponse } from "../../../../..";

export default async function handler(
  req: NextApiRequest,
  res: SocketAPIResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const profile = await getCurrentUserProfileInPagesDir(req);
    if (!profile) return res.status(401).json({ error: "Unauthorized" });
    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;

    if (!content) return res.status(400).json({ error: "Content Missing" });
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

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversation.id,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${conversationId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json({ message });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
