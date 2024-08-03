"use client";

import { Mic, MicOff } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import ActionToolTip from "./action-tooltip";

const AudioButton = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAudio = !!searchParams?.get("audio");

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          audio: isAudio ? undefined : true,
        },
      },
      { skipNull: true }
    );
    router.push(url);
  };

  const Icon = isAudio ? MicOff : Mic;
  const tooltipLabel = isAudio ? "End Audio Call" : "Start Audio Call";
  return (
    <ActionToolTip side="bottom" label={tooltipLabel}>
      <button onClick={onClick} className="hover:opacity-75 transition mr-4">
        <Icon className="text-zinc-500 dark:text-zinc-400 scale-75 hover:rotate-[360deg] transition-transform duration-500" />
      </button>
    </ActionToolTip>
  );
};

export default AudioButton;
