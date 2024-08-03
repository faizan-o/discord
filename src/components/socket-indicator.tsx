"use client";

import { useSocketContext } from "./providers/socket-provider";

const SocketIndicator = () => {
  const { isConnected } = useSocketContext();
  if (!isConnected)
    return (
      <div className="border-yellow-500 border-[1px] p-2 rounded-md bg-yellow-500 bg-opacity-15">
        <h1 className="text-yellow-500 text-xs">Disconnected: Polling</h1>
      </div>
    );
  return (
    <div className="border-emerald-500 border-[1px] p-2 rounded-md bg-emerald-500 bg-opacity-15">
      <h1 className="text-emerald-500 text-xs">Connected: Realtime</h1>
    </div>
  );
};

export default SocketIndicator;
