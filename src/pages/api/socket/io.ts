import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { SocketAPIResponse } from "../../../..";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: SocketAPIResponse) => {
  try {
    console.log("Here");
    if (!res?.socket?.server?.io) {
      const path = "/api/socket/io";
      const httpServer: NetServer = res.socket.server as any;
      const io = new ServerIO(httpServer, {
        path,
        addTrailingSlash: false,
      });
      res.socket.server.io = io;
    }
    res.end();
  } catch (err) {
    res.end();
  }
};

export default ioHandler;
