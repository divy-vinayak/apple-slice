import prisma from "@/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const dementiaTypes = await prisma.dementiaTypes.findMany();
        return NextResponse.json({ dementiaTypes }, { status: 200 });
    } catch (error) {
        console.error({ error });
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
