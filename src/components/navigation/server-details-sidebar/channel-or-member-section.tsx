"use client";

import ActionToolTip from "@/components/action-tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { ChannelType, MemberRole, Profile } from "@prisma/client";
import { ChevronDown, Edit, Lock, Plus, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useServerContext } from "@/components/providers/server-provider";
import { ChannelIcon } from "@/lib/map";

const SectionHeader = ({
  label,
  children,
  type,
  channelType,
}: {
  label: string;
  children: React.ReactNode;
  type: "Channel" | "Member";
  channelType?: ChannelType;
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const { onOpen } = useModal();
  return (
    <Collapsible open={isExpanded} onOpenChange={(val) => setIsExpanded(val)}>
      <div className="w-full h-10 flex justify-between items-center px-2">
        <h1 className="font-normal text-sm"># {label}</h1>
        <div className="flex space-x-2">
          {type !== "Member" && (
            <ActionToolTip side="top" label={`Add Another Channel`}>
              <Plus
                className="w-6"
                onClick={() => {
                  onOpen("CreateChannel", { channelType });
                }}
              />
            </ActionToolTip>
          )}
          <CollapsibleTrigger className="w-full">
            <ActionToolTip
              side="top"
              label={isExpanded ? "Collapse Content" : "Expand Content"}
            >
              <ChevronDown
                className={cn("w-4 rotate-0 transition-all duration-500", {
                  "rotate-180": isExpanded,
                })}
              />
            </ActionToolTip>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
};

const ChannelSection = ({
  label,
  data,
  channelType,
}: {
  label: string;
  data: any[];
  channelType: ChannelType;
}) => {
  const { activeServer, currentProfile } = useServerContext();

  const isAdmin =
    currentProfile &&
    activeServer &&
    activeServer.adminProfileId === currentProfile.id;
  const isModerator =
    currentProfile &&
    activeServer &&
    activeServer.members.find((member) => member.id === currentProfile.id)
      ?.role === MemberRole.MODERATOR;
  const { serverId } = useParams() as { serverId: string };
  const { onOpen } = useModal();
  return (
    <section>
      <SectionHeader label={label} type="Channel" channelType={channelType}>
        <div>
          {data.map((channel) => (
            <div
              key={channel.id}
              className="w-full group/channel h-full p-4 flex items-center justify-between  text-sm cursor-pointer"
            >
              <Link
                href={`/servers/${serverId}/channels/${channel.id}`}
                className="w-full h-full"
              >
                <div className="flex items-center space-x-2 h-full">
                  <ChannelIcon type={channel.type} className="w-4" />
                  <h1>{channel.name}</h1>
                </div>
              </Link>
              {(isAdmin || isModerator) && (
                <div className="opacity-0 transition-[opacity] duration-1000  group-hover/channel:opacity-100 flex space-x-2">
                  {channel.name === "General" &&
                  channel.type === ChannelType.TEXT ? (
                    <Lock className="w-4" />
                  ) : (
                    <>
                      <Edit
                        className="w-4"
                        onClick={() =>
                          onOpen("EditChannel", {
                            channel,
                          })
                        }
                      />
                      <Trash
                        className="w-4"
                        onClick={() =>
                          onOpen("DeleteChannel", {
                            channel,
                          })
                        }
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionHeader>
    </section>
  );
};

const MembersSection = ({ label, data }: { label: string; data: any[] }) => {
  const { serverId } = useParams() as { serverId: string };
  return (
    <section>
      <SectionHeader label={label} type="Member">
        <div>
          {data.map((member) => (
            <Link
              key={member.id}
              href={`/servers/${serverId}/conversations/${member.id}`}
            >
              <div className="py-4 pl-4 flex items-center space-x-2 text-sm cursor-pointer hover:bg-zinc-700">
                <Image
                  src={member.profile.imageUrl}
                  alt="Profile Image"
                  width={1920}
                  height={1080}
                  className="w-6 h-6 rounded-full"
                />
                <h1>{member.profile.name}</h1>
              </div>
            </Link>
          ))}
        </div>
      </SectionHeader>
    </section>
  );
};

const ChannelOrMemberSection = ({
  label,
  data,
  type,
  channelType,
}: {
  label: string;
  data: any[];
  type: "Channel" | "Member";
  channelType?: ChannelType;
}) => {
  switch (type) {
    case "Channel":
      return (
        <ChannelSection label={label} data={data} channelType={channelType!} />
      );
    case "Member":
      return <MembersSection label={label} data={data} />;
  }
};

export default ChannelOrMemberSection;
