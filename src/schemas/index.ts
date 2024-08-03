import { ChannelType } from "@prisma/client";
import z from "zod";

export const CreateServerSchema = z.object({
  name: z.string().min(1, "Server Name Is Required"),
  imageUrl: z.string().min(1, "Image Is Required"),
});

export const EditServerSchema = z.object({
  name: z.string().min(1, "Server Name Is Required"),
  imageUrl: z.string().min(1, "Image Is Required"),
});

export const CreateChannelSchema = z.object({
  name: z.string().min(1, "Server Name Is Required"),
  channelType: z.nativeEnum(ChannelType).default(ChannelType.TEXT),
});

export const UpdateChannelSchema = z.object({
  name: z.string().min(1, "Server Name Is Required"),
});

export const MessageSchema = z.object({
  content: z.string().min(1),
  fileUrl: z.string(),
});

export const EditMessageSchema = z.object({
  content: z.string().min(1),
});
