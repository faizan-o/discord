"use client";

import { useEffect } from "react";
import { useModal } from "@/hooks/use-modal-store";
import { useServerContext } from "./providers/server-provider";
import { useRouter } from "next/navigation";

const HomeComponent = () => {
  const { onOpen } = useModal();

  useEffect(() => {
    onOpen("CreateServer");
  }, [onOpen]);

  const { servers } = useServerContext();
  const router = useRouter();

  if (servers && servers.length > 0)
    return router.push(
      `/servers/${servers[0].id}/channels/${servers[0].channels[0].id}`
    );

  return <div className="w-full h-full flex justify-center items-center"></div>;
};

export default HomeComponent;
