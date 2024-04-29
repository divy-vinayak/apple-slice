import prisma from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const session = await getServerSession();
        if (!session || !session.user || !session.user.email) {
            return redirect("/api/auth/signin");
        }

        const requestBody = await request.json();
        const { patientInfo } = requestBody;

        const userDb = await prisma.user.findFirst({
            where: {
                email: session.user.email,
            },
        });

        const countryDb = await prisma.country.findFirst({
            where: {
                name: patientInfo.country,
            },
        });

        const dementiaTypeDb = await prisma.dementiaTypes.findFirst({
            where: {
                type: patientInfo.dementiaType,
            },
        });

        const newPatient = await prisma.patient.create({
            data: {
                user_id: userDb?.id,
                name: patientInfo.name,
                sex: patientInfo.sex,
                dementiaTypes_id: dementiaTypeDb?.id,
                dementia_stage: patientInfo.dementiaStage,
                country_id: countryDb?.id,
                other_conditions: patientInfo.other_conditions,
                age: patientInfo.age,
                caregiver_relation: patientInfo.caregiver_relation,
                caregiver_shift_duration: patientInfo.caregiver_shift_duration,
                description: patientInfo.description,
            },
        });

        return NextResponse.json(
            {
                message: "Patient created successfully",
                patientInfo: newPatient,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error({ error });
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
