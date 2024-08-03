"use server";

import { getCurrentUserProfile } from "@/data/profile";
import { getServerById } from "@/data/server";
import { ServerActionResponse } from "../..";
import { MemberRole } from "@prisma/client";
import { db } from "@/lib/db";

export const kickMember = async ({
  serverId,
  memberId,
}: {
  serverId: string;
  memberId: string;
}): Promise<ServerActionResponse> => {
  const profile = await getCurrentUserProfile();
  if (!profile) return { wasSuccessful: false, message: "No Profile Found" };
  const server = await getServerById(serverId);
  if (!server) return { wasSuccessful: false, message: "Server Not Found" };
  const isAdmin = server.adminProfileId === profile.id;
  const isModerator =
    server.members.find((member) => member.id === profile.id)?.role ===
    MemberRole.MODERATOR;

  if (!(isAdmin || isModerator))
    return { wasSuccessful: false, message: "You Cannot Perform This Action" };
  if (memberId === server.adminProfileId)
    return { wasSuccessful: false, message: "This Action Is Not Allowed" };
  try {
    const deleted = await db.member.delete({
      where: {
        id: memberId,
      },
    });
    return {
      wasSuccessful: true,
      message: `Kicked The User Out Of #${server.name}`,
    };
  } catch (err) {
    return { wasSuccessful: false, message: "Something Went Wrong" };
  }
};

export const makeMemberMoerator = async ({
  serverId,
  memberId,
}: {
  serverId: string;
  memberId: string;
}): Promise<ServerActionResponse> => {
  const profile = await getCurrentUserProfile();
  if (!profile) return { wasSuccessful: false, message: "No Profile Found" };
  const server = await getServerById(serverId);
  if (!server) return { wasSuccessful: false, message: "Server Not Found" };
  const isAdmin = server.adminProfileId === profile.id;
  const isModerator =
    server.members.find((member) => member.id === profile.id)?.role ===
    MemberRole.MODERATOR;

  if (!(isAdmin || isModerator))
    return { wasSuccessful: false, message: "You Cannot Perform This Action" };
  if (memberId === server.adminProfileId)
    return { wasSuccessful: false, message: "This Action Is Not Allowed" };
  try {
    await db.member.update({
      where: {
        id: memberId,
        serverId: server.id,
      },
      data: {
        role: MemberRole.MODERATOR,
      },
    });
    return {
      wasSuccessful: true,
      message: `Made The User Moderator Of #${server.name}`,
    };
  } catch (err) {
    return { wasSuccessful: false, message: "Something Went Wrong" };
  }
};

export const makeMemberGuest = async ({
  serverId,
  memberId,
}: {
  serverId: string;
  memberId: string;
}): Promise<ServerActionResponse> => {
  const profile = await getCurrentUserProfile();
  if (!profile) return { wasSuccessful: false, message: "No Profile Found" };
  const server = await getServerById(serverId);
  if (!server) return { wasSuccessful: false, message: "Server Not Found" };
  const isAdmin = server.adminProfileId === profile.id;
  const isModerator =
    server.members.find((member) => member.id === profile.id)?.role ===
    MemberRole.MODERATOR;

  if (!(isAdmin || isModerator))
    return { wasSuccessful: false, message: "You Cannot Perform This Action" };
  if (memberId === server.adminProfileId)
    return { wasSuccessful: false, message: "This Action Is Not Allowed" };
  try {
    await db.member.update({
      where: {
        id: memberId,
        serverId: server.id,
      },
      data: {
        role: MemberRole.GUEST,
      },
    });
    return {
      wasSuccessful: true,
      message: `Made The User Moderator Of #${server.name}`,
    };
  } catch (err) {
    return { wasSuccessful: false, message: "Something Went Wrong" };
  }
};

export const leaveServer = async ({
  serverId,
}: {
  serverId: string;
}): Promise<ServerActionResponse> => {
  const profile = await getCurrentUserProfile();
  if (!profile)
    return { wasSuccessful: false, message: "Could Not Find Your Profile" };
  try {
    await db.member.deleteMany({
      where: {
        serverId,
        profileId: profile.id,
        NOT: {
          role: MemberRole.ADMIN,
        },
      },
    });
    return { wasSuccessful: true, message: "Successfully Left The Server" };
  } catch (err) {
    return { wasSuccessful: false, message: "Something Went Wrong" };
  }
};
