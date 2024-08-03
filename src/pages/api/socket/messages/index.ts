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
    const { serverId, channelId } = req.query;

    if (!content) return res.status(400).json({ error: "Content Missing" });
    if (!serverId) return res.status(400).json({ error: "Server ID Missing" });
    if (!channelId)
      return res.status(400).json({ error: "Channel ID Missing" });

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
    if (!server) return res.status(404).json({ error: "Server Not Found" });

    const channel = await db.channel.findUnique({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });
    if (!channel) return res.status(404).json({ error: "Channel Not Found" });

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );
    if (!member) return res.status(404).json({ error: "Member Not Found" });

    const message = await db.channelMessage.create({
      data: {
        content,
        fileUrl,
        channelId: channel.id,
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

    const channelKey = `chat:${channelId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json({ message });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
