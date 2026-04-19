import { redirect } from "next/navigation";
import {getInitialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";

import { InitialModel } from "@/components/modals/initial-models";

const SetupPage = async ()=>{
    const profile = await getInitialProfile();

    const server = await db.server.findFirst({
        where:{
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if(server){
        return redirect(`/servers/${server.id}`);
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <InitialModel/>
        </div>
    );
}

export default SetupPage;
