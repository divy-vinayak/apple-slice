import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";

interface UserDataType {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
}

function validateUserData(userData: UserDataType ) {
    const emailSchmea = z.string().email();
    try{
        emailSchmea.parse(userData.email);
        return true;
    } catch(e) {
        console.error(e);
        return false;
    }
}

export async function POST(request: NextRequest) {
    const userData: UserDataType = await request.json();
    console.log({ userData });

    // check for valid email address - use zod
    const userIsValid = validateUserData(userData);
    if (!userIsValid) {
        return NextResponse.json({message: 'invalidEmail'}, {status: 400});
    }
    // check if user exists
    const userFromDb = await prisma.user.findFirst({
        where: {
            email: userData.email,
        }
    })

    if(userFromDb) {
        return NextResponse.json({message: 'User already exists'}, {status: 409})
    }

    const hashedPassword: string = await bcrypt.hash(userData.password, 10);
    console.log({ hashedPassword });

    const res = await prisma.user.create({
        data: {
            username: userData.email,
            email: userData.email,
            name: userData.name,
            password: hashedPassword,
        },
    });

    return NextResponse.json(
        {
            data: {
                id: res.id,
                username: res.username,
                email: res.email,
                name: res.name,
                created_at: res.created_at,
            },
        },
        { status: 201 }
    );
}
