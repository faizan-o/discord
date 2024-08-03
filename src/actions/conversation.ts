"use server";

import { getConversation } from "@/data/conversation";
import { getCurrentUserProfile } from "@/data/profile";
import { db } from "@/lib/db";
import { ConversationWithMemberProfiles } from "../..";

export const getOrCreateConversation = async ({
  otherMemberId,
  serverId,
}: {
  otherMemberId: string;
  serverId: string;
}): Promise<ConversationWithMemberProfiles | null> => {
  const firstProfile = await getCurrentUserProfile();
  if (!firstProfile) return null;
  const firstMember = await db.member.findFirst({
    where: {
      profileId: firstProfile.id,
      serverId,
    },
  });
  const existing = await getConversation({
    firstMemberId: firstMember!.id,
    otherMemberId,
  });
  if (existing) return existing;

  try {
    return await db.conversation.create({
      data: {
        memberOneId: firstMember!.id,
        memberTwoId: otherMemberId,
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
