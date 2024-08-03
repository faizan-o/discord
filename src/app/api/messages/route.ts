import { getCurrentUserProfile } from "@/data/profile";
import { db } from "@/lib/db";
import { ChannelMessage } from "@prisma/client";
import { NextResponse } from "next/server";
import { MESSAGE_BATCH } from "@/constants";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const profile = getCurrentUserProfile();
  if (!profile) return new NextResponse("Unauthorized", { status: 500 });
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!channelId)
      return new NextResponse("Channel ID Missing", { status: 401 });

    let messages: ChannelMessage[] = [];

    if (cursor) {
      messages = await db.channelMessage.findMany({
        take: MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.channelMessage.findMany({
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGE_BATCH) {
      nextCursor = messages[MESSAGE_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (err) {
    console.log(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
