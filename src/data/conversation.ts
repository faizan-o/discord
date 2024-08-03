import { Conversation } from "@prisma/client";
import { db } from "@/lib/db";
import { ConversationWithMemberProfiles } from "../..";

export const getConversation = async ({
  firstMemberId,
  otherMemberId,
}: {
  firstMemberId: string;
  otherMemberId: string;
}): Promise<ConversationWithMemberProfiles | null> => {
  try {
    return await db.conversation.findFirst({
      where: {
        OR: [
          {
            memberOneId: otherMemberId,
            memberTwoId: firstMemberId,
          },
          {
            memberOneId: firstMemberId,
            memberTwoId: otherMemberId,
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
  } catch (err) {
    return null;
  }
};
