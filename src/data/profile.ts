"use server";

import { db } from "@/lib/db";
import { currentUser, getAuth } from "@clerk/nextjs/server";
import { Profile } from "@prisma/client";
import { NextApiRequest } from "next";

export const getCurrentUserProfile = async (): Promise<Profile | null> => {
  const current = await currentUser();
  if (!current) return null;

  try {
    const profile = await db.profile.findUnique({
      where: {
        userId: current.id,
      },
    });
    return profile;
  } catch (err) {
    return null;
  }
};

export const getCurrentUserProfileInPagesDir = async (
  req: NextApiRequest
): Promise<Profile | null> => {
  const { userId } = getAuth(req);
  if (!userId) return null;

  try {
    const profile = await db.profile.findUnique({
      where: {
        userId,
      },
    });
    return profile;
  } catch (err) {
    return null;
  }
};
