"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { CreateServerModal } from "../modals/create-server-models";
import { InviteModal } from "../modals/invite-model";
// const CreateServerModal = dynamic(
//   () =>
//     import("../modals/create-server-models").then(
//       (module) => module.CreateServerModal
//     ),
//   {
//     ssr: false,
//   }
// );

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
    </>
  );
};
