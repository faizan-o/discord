import { ChannelIcon, IconMap } from "@/lib/map";
import { Button } from "../ui/button";

const ChatWelcome = ({
  name,
  type,
}: {
  name: string;
  type: "Channel" | "Conversation";
}) => {
  return (
    <div className="mb-4 flex items-center py-5">

      <div className="px-8 space-y-1">
        <h1 className="font-semibold text-2xl">
          Welcome To Chat {type === "Channel" ? "In #" : "With "}
          {name}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This Is The Beginning Of {type !== "Channel" && "Your"} Chat{" "}
          {type === "Channel" ? "In #" : "With "}
          {name}
        </p>
      </div>
    </div>
  );
};

export default ChatWelcome;
