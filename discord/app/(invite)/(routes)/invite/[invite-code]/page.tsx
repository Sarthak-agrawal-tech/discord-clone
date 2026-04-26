import { getInitialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface InviteCodePageProps{
    params: Promise<{
        inviteCode: string;
    }>
}



const InviteCodePage = async ({
    params
}: InviteCodePageProps) => {
    const {inviteCode} = await params;
    const profile = await getInitialProfile();

    if(!inviteCode){
        console.log("in invite code")
        return redirect("/");
    }

    const existingServer =await db.server.findFirst({
        where:{
            inviteCode: inviteCode,
            members:{
                some:{
                    profileId: profile.id
                }
            }
        }
    })

    if(existingServer){
        console.log("in existing code");
        return redirect(`/servers/${existingServer.id}`);
    }

    const server = await db.server.update({
        where:{
            inviteCode: inviteCode,
        },
        data:{
            members:{
                create:[
                {
                    profileId: profile.id,
                }
                ]
            }
        },
        select: {
            id: true,
        },
    }).catch(() => null);

    if(server){
        console.log(`{server.id}`);
        return redirect(`/servers/${server.id}`)
    }

    return null;
}
 
export default InviteCodePage
