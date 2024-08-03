"use client";

import CreateChannel from "../modals/create-channel";
import CreateServer from "../modals/create-server";
import DeleteMessage from "../modals/delete-message";
import DeleteServer from "../modals/delete-server";
import EditChannel from "../modals/edit-channel";
import EditServer from "../modals/edit-server";
import InvitePeople from "../modals/invite-people";
import LeaveServer from "../modals/leave-server";
import ManageMembers from "../modals/manage-members";
import SearchModal from "../modals/search-modal";
import SendFileMessage from "../modals/send-file-message";
import DeleteChannel from "../modals/delete-channel";

const ModalProvider = () => {
  return (
    <>
      <CreateServer />
      <EditServer />
      <InvitePeople />
      <CreateChannel />
      <ManageMembers />
      <LeaveServer />
      <DeleteServer />
      <SearchModal />
      <EditChannel />
      <DeleteChannel />
      <SendFileMessage />
      <DeleteMessage />
    </>
  );
};

export default ModalProvider;
