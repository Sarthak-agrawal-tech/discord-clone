"use client";

import { useSyncExternalStore } from "react";
import { CreateServerModal } from "../modals/create-server-models";
import { InviteModal } from "../modals/invite-model";
import { EditServerModal } from "../modals/edit-server-model";
import { MembersModal } from "../modals/members-model";
import { CreateChannelModal } from "../modals/create-channel-models";


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
    </>
  );
};
