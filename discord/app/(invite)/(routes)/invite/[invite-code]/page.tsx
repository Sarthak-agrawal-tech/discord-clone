import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface InviteCodePageProps{
    params: Promise<{
        "invite-code": string;
    }>
}



const InviteCodePage = async ({
    params
}: InviteCodePageProps) => {
    try {
        const {["invite-code"]: inviteCode} = await params;
        console.log("\n🔗 [INVITE PAGE] Invite page accessed with code:", inviteCode);
        
        const profile = await currentProfile();
        console.log("👤 [INVITE PAGE] Current profile ID:", profile?.id || "NO_PROFILE");

        // If user is not authenticated, redirect to sign up
        if(!profile){
            console.log("↗️ [INVITE PAGE] Redirecting to sign-up (not authenticated)");
            return redirect("/sign-up");
        }

        if(!inviteCode){
            console.log("❌ [INVITE PAGE] No invite code provided");
            return redirect("/");
        }

        // Check if user is already a member of this server
        console.log("🔍 [INVITE PAGE] Checking if user is already a member...");
        const existingServer = await db.server.findFirst({
            where:{
                inviteCode,
                members:{
                    some:{
                        profileId: profile.id
                    }
                }
            }
        });

        if(existingServer){
            console.log("✅ [INVITE PAGE] User already member, redirecting to server:", existingServer.id);
            return redirect(`/servers/${existingServer.id}`);
        }

        console.log("🔍 [INVITE PAGE] Checking if server with this invite code exists...");
        // Check if server with this invite code exists
        const serverExists = await db.server.findUnique({
            where: {
                inviteCode
            },
            select: {
                id: true
            }
        });

        if (!serverExists) {
            console.error("❌ [INVITE PAGE] No server found with invite code:", inviteCode);
            return redirect("/");
        }

        console.log("📍 [INVITE PAGE] Found server:", serverExists.id);
        console.log("➕ [INVITE PAGE] Adding user to server...");

        // Add user to the server
        const server = await db.server.update({
            where:{
                inviteCode,
            },
            data:{
                members:{
                    create:{
                        profileId: profile.id,
                    }
                }
            },
            select: {
                id: true,
            },
        })

        console.log("✅ [INVITE PAGE] User successfully added to server:", server.id);
        console.log("↗️ [INVITE PAGE] Redirecting to server:", server.id);
        return redirect(`/servers/${server.id}`)
    } catch (error) {
        console.error("🔴 [INVITE PAGE] Error in invite page:", error);
        if (error instanceof Error) {
            console.error("🔴 [INVITE PAGE] Error message:", error.message);
            console.error("🔴 [INVITE PAGE] Error stack:", error.stack);
        }
        return redirect("/");
    }
}
 
export default InviteCodePage
