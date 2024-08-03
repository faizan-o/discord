import { ChannelType } from "@prisma/client";
import { ServerWithChannelAndMembers } from "../../../..";
import ChannelOrMemberSection from "./channel-or-member-section";
import { useServerContext } from "@/components/providers/server-provider";

const ServerDetailsSidebarSections = () => {
  const { activeServer } = useServerContext();

  const textChannels =
    (activeServer &&
      activeServer.channels.filter(
        (channel) => channel.type === ChannelType.TEXT
      )) ||
    [];
  const audioChannels =
    (activeServer &&
      activeServer.channels.filter(
        (channel) => channel.type === ChannelType.AUDIO
      )) ||
    [];
  const videoChannels =
    (activeServer &&
      activeServer.channels.filter(
        (channel) => channel.type === ChannelType.VIDEO
      )) ||
    [];
  const members = (activeServer && activeServer.members) || [];

  return (
    <div>
      <ChannelOrMemberSection
        label="Text Channels"
        data={textChannels}
        type="Channel"
        channelType={ChannelType.TEXT}
      />
      <ChannelOrMemberSection
        label="Audio Channels"
        data={audioChannels}
        type="Channel"
        channelType={ChannelType.AUDIO}
      />
      <ChannelOrMemberSection
        label="Video Channels"
        data={videoChannels}
        type="Channel"
        channelType={ChannelType.VIDEO}
      />
      <ChannelOrMemberSection
        label="Server Members"
        data={members}
        type="Member"
      />
    </div>
  );
};

export default ServerDetailsSidebarSections;
