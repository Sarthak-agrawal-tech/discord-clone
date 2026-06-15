import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ serverId: string }> }
) {
    try {
        // OPTIMIZATION 1: Run non-dependent promises in parallel
        const [profile, resolvedParams] = await Promise.all([
            currentProfile(),
            params
        ]);

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // OPTIMIZATION 2: Only fetch fields required by the UI (Reduces database load)
        const server = await db.server.findUnique({
            where: {
                id: resolvedParams.serverId,
                profileId: profile.id, // Replace with members relation lookup if ordinary members access this
            },
            select: {
                id: true,
                name: true,
                imageUrl: true,
                inviteCode: true,
                // Add only other specific fields your UI renders
            }
        });

        if (!server) {
            return new NextResponse("Server Not Found", { status: 404 });
        }

        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_ID_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ serverId: string }> }
) {
    try {
        // Run profile fetch and route params parsing in parallel
        const [profile, resolvedParams, body] = await Promise.all([
            currentProfile(),
            params,
            req.json()
        ]);

        const { name, imageUrl } = body;

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const server = await db.server.update({
            where: {
                id: resolvedParams.serverId,
                profileId: profile.id,
            },
            data: { name, imageUrl },
            select: { id: true } // Don't return the full heavy object if frontend doesn't need it
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ serverId: string }> }
) {
    try {
        const [profile, resolvedParams] = await Promise.all([
            currentProfile(),
            params
        ]);

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await db.server.delete({
            where: {
                id: resolvedParams.serverId,
                profileId: profile.id,
            },
        });

        return new NextResponse("Success", { status: 200 });
    } catch (error) {
        console.log("[SERVER_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
