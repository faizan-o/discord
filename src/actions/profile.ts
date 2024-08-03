"use server";
import { getCurrentUserProfile } from "@/data/profile";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import type { Profile } from "@prisma/client";

export const createOrGetExistingCurrentUserProfile =
  async (): Promise<Profile | null> => {
    try {
      const user = await currentUser();
      if (!user) {
        return null;
      }
      const existingProfile = await getCurrentUserProfile();
      if (existingProfile) return existingProfile;
      console.log(existingProfile);
      const newProfile = await db.profile.create({
        data: {
          name: `${user.firstName} ${user.lastName}`,
          userId: user.id,
          email: user.emailAddresses[0].emailAddress,
          imageUrl: user.imageUrl,
        },
      });
      return newProfile;
    } catch (err) {
      return null;
    }
  };
