"use client";

import { Plus } from "lucide-react";
import useModal from "@/hooks/use-modal-store";
import { ActionTooltip } from "@/components/action-tooltip";

export const NavigationAction = () => {
  const {onOpen} = useModal();

  return (
    <div>
      <ActionTooltip label="Add Server" side="right" align="center">
        <button onClick={() => onOpen("createServer")} className="group flex items-center">
          <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-zinc-100 dark:bg-neutral-700 group-hover:bg-emerald-500">
            <Plus size={25} className="text-emerald-500 transition group-hover:text-white" />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
