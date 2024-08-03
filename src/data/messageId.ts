"use server";

import { db } from "@/lib/db";

export const getFirstMessageId = async (params: any) => {
  let messageId = null;
  try {
    if (params.channelId) {
      const message = await db.channelMessage.findFirst({
        where: { channelId: params.channelId },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });
      messageId = message?.id;
    }

    return messageId;
  } catch (err) {
    return null;
  }
};
