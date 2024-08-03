import { ChannelType, MemberRole } from "@prisma/client";
import {
  MessageCircle,
  Mic,
  ShieldAlert,
  ShieldCheck,
  Video,
} from "lucide-react";

export const IconMap = {
  [ChannelType.TEXT]: MessageCircle,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

export const MemberRoleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />
  ),
};

export const ChannelIcon = (props: {
  type: ChannelType;
  className?: string;
  width?: number;
  height?: number;
}) => {
  const Icon = IconMap[props.type];

  return <Icon {...props} />;
};
