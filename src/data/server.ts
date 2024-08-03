"use server";

import { db } from "@/lib/db";
import { getCurrentUserProfile } from "./profile";
import { ServerWithChannelAndMembers } from "../..";
import { Server } from "@prisma/client";

export const getCurrentUserServers = async (): Promise<
  ServerWithChannelAndMembers[] | null
> => {
  const profile = await getCurrentUserProfile();
  if (!profile) return null;
  try {
    const server = await db.server.findMany({
      where: {
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        adminProfile: true,
        members: {
          include: { profile: true },
        },
        channels: true,
      },
    });
    return server;
  } catch (err) {
    return null;
  }
};

export const getServerById = async (
  id: string
): Promise<ServerWithChannelAndMembers | null> => {
  const profile = await getCurrentUserProfile();
  if (!profile) return null;
  try {
    const server: ServerWithChannelAndMembers | null =
      await db.server.findUnique({
        where: {
          id,
        },
        include: {
          adminProfile: true,
          members: {
            include: {
              profile: true,
            },
          },
          channels: true,
        },
      });

    const member =
      server &&
      server.members.find((member) => member.profileId === profile.id);
    if (!member) return null;
    return server;
  } catch (err) {
    return null;
  }
};
