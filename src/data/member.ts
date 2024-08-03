"use server";
import { db } from "@/lib/db";
import { getCurrentUserProfile } from "./profile";

export const getCurrentMember = async (serverId: string) => {
  const profile = await getCurrentUserProfile();
  if (!profile) return null;
  try {
    return await db.member.findFirst({
      where: {
        profileId: profile.id,
        serverId,
      },
      include: {
        profile: true,
      },
    });
  } catch (err) {
    return null;
  }
};
