"use server";

import { getCurrentUserProfile } from "@/data/profile";
import { db } from "@/lib/db";
import { CreateServerSchema } from "@/schemas";
import { Channel, ChannelType, MemberRole, type Server } from "@prisma/client";
import z from "zod";
import { v4 as uuidV4 } from "uuid";
import { ServerActionResponse } from "../..";
import { getServerById } from "@/data/server";

export const createServer = async (
  values: z.infer<typeof CreateServerSchema>
): Promise<Server&{channels: Channel[]} | null> => {
  const profile = await getCurrentUserProfile();
  if (!profile) return null;
  const validated = CreateServerSchema.safeParse(values);
  if (!validated.success) return null;
  const { name, imageUrl } = validated.data;
  try {
    const inviteCode = uuidV4();
    const newServer = await db.server.create({
      data: {
        name,
        imageUrl,
        adminProfileId: profile.id,
        inviteCode,
        members: {
          create: {
            role: MemberRole.ADMIN,
            profileId: profile.id,
          },
        },
        channels: {
          create: {
            name: "General",
            type: ChannelType.TEXT,
            profileId: profile.id,
          },
        },
      },
      include: {
        channels: true
      }
    });

    return newServer;
  } catch (err) {
    return null;
  }
};

export const updateServerById = async (
  values: z.infer<typeof CreateServerSchema>,
  id: string
): Promise<ServerActionResponse> => {
  const profile = await getCurrentUserProfile();
  if (!profile) return { wasSuccessful: false, message: "No Profile Found" };
  const validated = CreateServerSchema.safeParse(values);
  if (!validated.success)
    return { wasSuccessful: false, message: "Invalid Input Found" };
  const { name, imageUrl } = validated.data;
  const existingServer = await getServerById(id);
  if (!existingServer)
    return {
      wasSuccessful: false,
      message: "Servrer Does Not Exist",
    };
  const isModerator =
    existingServer.members.find((member) => member.id === profile.id)?.role ===
    MemberRole.MODERATOR;
  if (existingServer!.adminProfileId !== profile.id || isModerator)
    return {
      wasSuccessful: false,
      message: "Only Admin Can Perform This Action",
    };
  try {
    await db.server.update({
      where: {
        id,
      },
      data: {
        name,
        imageUrl,
      },
    });
    return { wasSuccessful: true, message: "Updated Server Successfully" };
  } catch (err) {
    return { wasSuccessful: false, message: "Something Went Wrong" };
  }
};

export const generateNewInviteCode = async (
  id: string
): Promise<string | null> => {
  const profile = await getCurrentUserProfile();
  if (!profile) return null;
  const existingServer = await getServerById(id);
  if (!existingServer) return null;
  const isModerator =
    existingServer.members.find((member) => member.id === profile.id)?.role ===
    MemberRole.MODERATOR;
  if (existingServer!.adminProfileId !== profile.id || isModerator) return null;

  try {
    const inviteCode = uuidV4();
    await db.server.update({
      where: {
        id,
      },
      data: {
        inviteCode,
      },
    });
    return inviteCode;
  } catch (err) {
    return null;
  }
};

export const addUserToServerByInviteCode = async (
  inviteCode: string
): Promise<
  ServerActionResponse & { serverId?: string; channelId?: string }
> => {
  const profile = await getCurrentUserProfile();
  if (!profile) return { wasSuccessful: false, message: "No Profile Found" };
  try {
    const existingServer = await db.server.findUnique({
      where: {
        inviteCode,
      },
      include: {
        members: {
          include: { profile: true },
        },
        channels: true
      },
    });
    if (!existingServer)
      return { wasSuccessful: false, message: "No Server Found" };
    const existingMember = existingServer.members.find(
      (member) => member.profileId === profile.id
    );
    if (existingMember)
      return {
        wasSuccessful: true,
        message: `You Are Already A Member of ${ existingServer.name }`,
        serverId: existingServer.id,
        channelId: existingServer.channels[0].id
      };
    const server = await db.server.update({
      where: {
        inviteCode,
      },
      data: {
        members: {
          create: {
            profileId: profile.id,
          },
        },
      },
    });
    const channel = await db.channel.findFirst({
      where: {
        serverId: server.id,
        name: "General",
      },
    });
    return {
      wasSuccessful: true,
      message: `Successfully Added You To #${server.name}`,
      channelId: (channel && channel.id) || undefined,
    };
  } catch (err) {
    return { wasSuccessful: false, message: "Something Went Wrong" };
  }
};

export const deleteServer = async ({ serverId }: { serverId: string }) => {
  const profile = await getCurrentUserProfile();
  if (!profile) return { wasSuccessful: false, message: "No Profile Found" };
  const existingServer = await getServerById(serverId);
  if (!existingServer)
    return {
      wasSuccessful: false,
      message: "Servrer Does Not Exist",
    };
  if (existingServer!.adminProfileId !== profile.id)
    return {
      wasSuccessful: false,
      message: "Only Admin Can Perform This Action",
    };
  try {
    await db.server.delete({
      where: {
        id: existingServer.id,
      },
    });
    return { wasSuccessful: true, message: "Deleted Server Successfully" };
  } catch (err) {
    return { wasSuccessful: false, message: "Something Went Wrong" };
  }
};
