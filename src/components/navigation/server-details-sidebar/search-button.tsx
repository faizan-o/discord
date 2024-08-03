"use client";

import { Search } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import ActionToolTip from "@/components/action-tooltip";
import { useServerContext } from "@/components/providers/server-provider";

const SearchButton = () => {
  const { onOpen } = useModal();

  const { activeServer } = useServerContext();

  if (!activeServer) return null;

  return (
    <div>
      <ActionToolTip side="right" label="Press Shift + M Or Click To Search">
        <div
          onClick={(_) => onOpen("SearchModal")}
          className="px-2 py-5 cursor-pointer flex justify-between items-center"
        >
          <div className="flex space-x-2 items-center">
            <Search className="w-3" />
            <h1 className="text-xs">Search</h1>
          </div>
          <div>
            <span className="zinc-800 text-[0.55rem] p-1 rounded-md">
              Alt + G
            </span>
          </div>
        </div>
      </ActionToolTip>
    </div>
  );
};

export default SearchButton;
