"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useModal } from "@/hooks/use-modal-store";
import { ChannelType } from "@prisma/client";
import { MessageCircle, Mic, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useServerContext } from "../providers/server-provider";

const SearchModal = () => {
  const { isOpen, type, onClose } = useModal();

  const isModalOpen = isOpen && type === "SearchModal";
  const handleClose = () => {
    onClose();
  };

  const { activeServer } = useServerContext();

  const textChannels =
    activeServer &&
    activeServer.channels.filter(
      (channel) => channel.type === ChannelType.TEXT
    );
  const audioChannels =
    activeServer &&
    activeServer.channels.filter(
      (channel) => channel.type === ChannelType.AUDIO
    );
  const videoChannels =
    activeServer &&
    activeServer.channels.filter(
      (channel) => channel.type === ChannelType.VIDEO
    );

  return (
    <CommandDialog open={isModalOpen} onOpenChange={handleClose}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No Results Found</CommandEmpty>
        <CommandGroup heading="Text Channels">
          {textChannels &&
            textChannels.map((channel) => (
              <CommandItem key={channel.id}>
                <Link
                  href={`/channels/${channel.id}`}
                  className="flex items-center space-x-2"
                >
                  <MessageCircle />
                  <span>{channel.name}</span>
                </Link>
              </CommandItem>
            ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Audio Channels">
          {audioChannels &&
            audioChannels.map((channel) => (
              <CommandItem key={channel.id}>
                <Link
                  href={`/channels/${channel.id}`}
                  className="flex items-center space-x-2"
                >
                  <Mic />
                  <span>{channel.name}</span>
                </Link>
              </CommandItem>
            ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Video Channels">
          {videoChannels &&
            videoChannels.map((channel) => (
              <CommandItem key={channel.id}>
                <Link
                  href={`/servers/${activeServer.id}/channels/${channel.id}`}
                  className="flex items-center space-x-2"
                >
                  <Video />
                  <span>{channel.name}</span>
                </Link>
              </CommandItem>
            ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Members">
          {activeServer &&
            activeServer.members.map((member) => (
              <CommandItem key={member.id}>
                <Link
                  href={`/servers/${activeServer.id}/conversations/${member.id}`}
                  className="flex items-center space-x-2"
                >
                  <Image
                    src={member.profile.imageUrl}
                    alt="Profile Image"
                    width={1920}
                    height={1080}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{member.profile.name}</span>
                </Link>
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default SearchModal;
