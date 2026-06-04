"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useModal from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../ui/user-avatar";
import { Check, Gavel, Loader, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";


const roleIconMap={
  "GUEST": null,
  "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
  "ADMIN": <ShieldAlert className="h-4 w-4 text-rose-500"/>
}

export const MembersModal = () => {
  const {onOpen, isOpen, onClose, type, data,} = useModal();
  const [loadingId, setLoadingId] = useState("");

  

  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: ServerWithMembersWithProfiles};
  if (!isModalOpen) {

    return null;
  }





  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
           <DialogDescription 
          className="text-center text-zinc-500">
          {server?.members?.length} Members
        </DialogDescription>
        </DialogHeader>
          <ScrollArea className="mt-8 max-h-[420px] pr-6">
            {server?.members?.map((member)=>(
              <div key={member.id} className="flex items-center gap-x-2 mb-6">
                <UserAvatar src={member.profile?.imageUrl}/>
                <div className="flex flex-col gap-y-1">
                  <div className="text-xs font-semibold flex items-center gap-x-1">
                    {member.profile.name}
                    {roleIconMap[member.role]}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {member.profile.email}
                  </p>

                </div>
                {server.profileId !== member.profileId && loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-zinc-500"/>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center cursor-pointer select-none outline-none">
                            <ShieldQuestion className="w-4 h-4 mr-2 pointer-events-none"/>
                            <span className="pointer-events-none">Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem>
                                <Shield className="w-4 h-4 mr-2"/>
                                Guest
                                {member.role === "GUEST" && (
                                  <Check className="w-4 h-4 ml-auto"/>
                                )}
                              </DropdownMenuItem>
                               <DropdownMenuItem>
                                <ShieldCheck className="w-4 h-4 mr-2"/>
                                Moderator
                                {member.role === "MODERATOR" && (
                                  <Check className="w-4 h-4 ml-auto"/>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator/>
                          <DropdownMenuItem>
                            <Gavel className="h-4 w-4 mr-2"/>
                            Kick
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
                {loadingId === member.id && (
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-500 ml-auto"/>
                )}
              </div>
            ))}
          </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
