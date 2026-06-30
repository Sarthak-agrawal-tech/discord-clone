"use client";

import { useSyncExternalStore } from "react";
import { CreateServerModal } from "../modals/create-server-models";
import { InviteModal } from "../modals/invite-model";
import { EditServerModal } from "../modals/edit-server-model";
import { MembersModal } from "../modals/members-model";
import { CreateChannelModal } from "../modals/create-channel-models";
import { LeaveServerModal } from "../modals/leave-server-model";
import { DeleteServerModal } from "../modals/delete-server-model";
import { DeleteChannelModal } from "../modals/delete-channel-model";
import { EditChannelModal } from "../modals/edit-channel-models";
import { MessageFileModal } from "../modals/message-file-modal";
import { DeleteMessageModal } from "../modals/delete-message-modal";
const emptySubscribe = () => () => {};

export const ModalProvider = () => {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />
      <InviteModal/>
      <EditServerModal/>
      <MembersModal/>
      <CreateChannelModal/>
      <LeaveServerModal/>
      <DeleteServerModal/>
      <DeleteChannelModal/>
      <EditChannelModal/>
      <MessageFileModal/>
      <DeleteMessageModal/>
    </>
  );
};
