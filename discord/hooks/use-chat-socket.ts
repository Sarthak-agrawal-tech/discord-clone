import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, Profile } from "@/lib/generated/prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
    addKey: string;
    updateKey: string;
    queryKey: string;
}

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile;
    }
}

export const useChatSocket = ({
    addKey,
    updateKey,
    queryKey,
}: ChatSocketProps) => {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) {
            return;
        }

        // ==========================================
        // 1. HANDLE REAL-TIME MESSAGE EDITS/UPDATES
        // ==========================================
        socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                // FIX: Removed invalid '.props' check and fixed spelling of '.length'
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return oldData;
                }

                const newData = oldData.pages.map((page: any) => {
                    return {
                        ...page,
                        // Avoid crashing if page.items is temporarily undefined
                        items: (page.items || []).map((item: MessageWithMemberWithProfile) => {
                            if (item.id === message.id) {
                                return message;
                            }
                            return item;
                        })
                    };
                });

                return {
                    ...oldData,
                    pages: newData,
                };
            });
        });

        // ==========================================
        // 2. HANDLE REAL-TIME NEW MESSAGES (ADD)
        // ==========================================
        socket.on(addKey, (message: MessageWithMemberWithProfile) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                // FIX: If there are no existing messages fetched yet, initialize the cache structure safely
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return {
                        pageParams: [undefined],
                        pages: [{
                            items: [message],
                        }]
                    };
                }

                // Create a shallow copy of the pages array to preserve cache immutability
                const newData = [...oldData.pages];

                // Prepend the new message safely onto the very first page array slot
                newData[0] = {
                    ...newData[0],
                    items: [
                        message,
                        ...(newData[0].items || []),
                    ]
                };

                return {
                    ...oldData,
                    pages: newData,
                };
            });
        });

        // Cleanup listeners to prevent severe memory leaks when channel changes
        return () => {
            socket.off(addKey);
            socket.off(updateKey);
        };
    }, [queryClient, addKey, queryKey, socket, updateKey]);
};
