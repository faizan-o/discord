"use client";

import { useEffect, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import type { Channel } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Loader2, Video } from "lucide-react";
import { ScaleLoader } from "react-spinners";

interface MediaRoomProps {
  audio: boolean;
  video: boolean;
  chatId: string;
}

const MediaRoom = ({ audio, video, chatId }: MediaRoomProps) => {
  const { user } = useUser();

  const [token, setToken] = useState<string>("");

  useEffect(() => {
    if (!user || !user.firstName || !user.lastName) {
      return;
    }

    const name = `${user.firstName} ${user.lastName}`;
    (async () => {
      try {
        const response = await fetch(
          `/api/livekit/?room=${chatId}&username=${name}`
        );
        const data = await response.json();
        setToken(data.token);
      } catch (err) {}
    })();
  }, [user?.firstName, user?.lastName, chatId]);

  if (!token) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ScaleLoader height={15} color="cyan" />
      </div>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      <div className="w-full flex justify-center pt-5 items-center">
        <VideoConference className="md:w-[85%]" />
      </div>
    </LiveKitRoom>
  );
};

export default MediaRoom;
