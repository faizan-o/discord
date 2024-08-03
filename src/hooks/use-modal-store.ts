import { create } from "zustand";
import { ServerWithChannelAndMembers } from "../..";
import { Channel, ChannelType } from "@prisma/client";

type ModalType =
  | "CreateServer"
  | "EditServer"
  | "InvitePeople"
  | "CreateChannel"
  | "ManageMembers"
  | "DeleteServer"
  | "LeaveServer"
  | "SearchModal"
  | "EditChannel"
  | "DeleteChannel"
  | "SendFileMessage"
  | "DeleteMessage";

interface ModalData {
  channel?: Channel;
  channelType?: ChannelType;
  apiUrl?: string;
  query?: Record<string, any>;
}

interface ModalStore {
  isOpen: boolean;
  data: ModalData;
  type: ModalType | null;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
