"use server";

import { getCurrentUserProfile } from "@/data/profile";
import { CreateChannelSchema, UpdateChannelSchema } from "@/schemas";
import z from "zod";
import { ServerActionResponse } from "../..";
import { getServerById } from "@/data/server";
import { ChannelType, MemberRole } from "@prisma/client";
import { db } from "@/lib/db";

export const createChannel = async ({
  values,
  serverId,
}: {
  values: z.infer<typeof CreateChannelSchema>;
  serverId: string;
}): Promise<ServerActionResponse & { channelId?: string }> => {
  const profile = await getCurrentUserProfile();
  if (!profile)
    return {
      wasSuccessful: false,
      message: "No Profile Found",
    };
  const server = await getServerById(serverId);
  if (!server)
    return {
      wasSuccessful: false,
      message: "No Server Found",
    };
  const isAdmin = server.adminProfileId === profile.id;
  const isModerator =
    server.members.find((member) => member.id === profile.id)?.role ===
    MemberRole.MODERATOR;
  if (!(isAdmin || isModerator))
    return {
      wasSuccessful: false,
      message: "You Cannot Perform This Action",
    };
  const validated = CreateChannelSchema.safeParse(values);
  if (!validated.success)
    return {
      wasSuccessful: false,
      message: "Invalid Input",
    };
  const { name, channelType } = validated.data;
  try {
    const channel = await db.channel.create({
      data: {
        profileId: profile.id,
        serverId: server.id,
        name,
        type: channelType,
      },
    });
    return {
      wasSuccessful: true,
      message: `Successfully Created #${name} in ${server.name}`,
      channelId: channel.id,
    };
  } catch (err) {
    return {
      wasSuccessful: false,
      message: "Something Went Wrong",
    };
  }
};

export const updateChannel = async ({
  values,
  channelId,
}: {
  values: z.infer<typeof UpdateChannelSchema>;
  channelId: string;
}): Promise<ServerActionResponse & { channelId?: string }> => {
  const profile = await getCurrentUserProfile();
  if (!profile)
    return {
      wasSuccessful: false,
      message: "No Profile Found",
    };
  const validated = CreateChannelSchema.safeParse(values);
  if (!validated.success)
    return {
      wasSuccessful: false,
      message: "Invalid Input",
    };
  const { name } = validated.data;
  try {
    const server = await db.server.findFirst({
      where: {
        channels: {
          some: {
            id: channelId,
          },
        },
      },
      include: {
        members: {
          include: { profile: true },
        },
      },
    });
    if (!server)
      return {
        wasSuccessful: false,
        message: "No Server Found",
      };
    const isAdmin = server.adminProfileId === profile.id;
    const isModerator =
      server.members.find((member) => member.id === profile.id)?.role ===
      MemberRole.MODERATOR;
    if (!(isAdmin || isModerator))
      return {
        wasSuccessful: false,
        message: "You Cannot Perform This Action",
      };
    const existing = await db.channel.findUnique({
      where: {
        id: channelId,
      },
    });
    if (!existing)
      return { wasSuccessful: false, message: "Channel Does Not Exist" };
    const channel = await db.channel.update({
      where: {
        id: channelId,
        NOT: {
          AND: {
            name: "General",
            type: ChannelType.TEXT,
          },
        },
      },
      data: {
        name,
      },
    });
    return {
      wasSuccessful: true,
      message: `Successfully Update #${name} to #${channel.name}`,
      channelId: channel.id,
    };
  } catch (err) {
    return {
      wasSuccessful: false,
      message: "Something Went Wrong",
    };
  }
};

export const deleteChannel = async ({ channelId }: { channelId: string }) => {
  const profile = await getCurrentUserProfile();
  if (!profile)
    return {
      wasSuccessful: false,
      message: "No Profile Found",
    };
  try {
    const server = await db.server.findFirst({
      where: {
        channels: {
          some: {
            id: channelId,
          },
        },
      },
      include: {
        members: {
          include: { profile: true },
        },
      },
    });
    if (!server)
      return {
        wasSuccessful: false,
        message: "No Server Found",
      };
    const isAdmin = server.adminProfileId === profile.id;
    const isModerator =
      server.members.find((member) => member.id === profile.id)?.role ===
      MemberRole.MODERATOR;
    if (!(isAdmin || isModerator))
      return {
        wasSuccessful: false,
        message: "You Cannot Perform This Action",
      };
    const existing = await db.channel.findUnique({
      where: {
        id: channelId,
      },
    });
    if (!existing)
      return { wasSuccessful: false, message: "Channel Does Not Exist" };
    const channel = await db.channel.delete({
      where: {
        id: channelId,
        serverId: server.id,
        NOT: {
          AND: {
            name: "General",
            type: ChannelType.TEXT,
          },
        },
      },
    });
    return {
      wasSuccessful: true,
      message: `Successfully Deleted #${channel.name}`,
    };
  } catch (err) {
    return {
      wasSuccessful: false,
      message: "Something Went Wrong",
    };
  }
};
