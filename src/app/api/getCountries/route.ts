import prisma from "@/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const countries = await prisma.country.findMany();
        return NextResponse.json({ countries }, { status: 200 });
    } catch (error) {
        console.error({ error });
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
