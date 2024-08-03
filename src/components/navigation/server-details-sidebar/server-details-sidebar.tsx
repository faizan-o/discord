"use client";

import { useParams } from "next/navigation";
import ServerMenu from "./server-menu";
import { ServerWithChannelAndMembers } from "../../../..";
import ServerDetailsSidebarSections from "./server-details-sidebar-sections";
import { useRouter } from "next/navigation";
import SearchButton from "./search-button";

const ServerActionsSidebar = () => {
  const router = useRouter();

  return (
    <div className="w-full max-h-full h-full overflow-y-auto bg-gray-400/25 dark:bg-[#1e1e22]">
      <ServerMenu />
      <SearchButton />
      <ServerDetailsSidebarSections  />
    </div>
  );
};

export default ServerActionsSidebar;
