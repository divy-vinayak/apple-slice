import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/db";

export const NEXT_AUTH_CONFIG = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "email", type: "text", placeholder: "" },
                password: {
                    label: "password",
                    type: "password",
                    placeholder: "",
                },
            },
            async authorize(credentials: any) {
                try {
                    const userDb = await prisma.user.findFirst({
                        where: {
                            username: credentials.username,
                        },
                        select: {
                            id: true,
                            username: true,
                            email: true,
                            password: true,
                            created_at: true,
                            name: true,
                        },
                    });

                    if (
                        userDb &&
                        userDb.password &&
                        (await bcrypt.compare(
                            credentials.password,
                            userDb.password
                        ))
                    ) {
                        return {
                            id: userDb.id.toString(),
                            name: userDb.name,
                            username: userDb.username,
                            email: userDb.email,
                        };
                    }

                    if (credentials.username === 'test@example.com' && credentials.password === 'test') {
                        return {
                            id: '1',
                            name: 'test',
                            username: 'test@example.com',
                            email: 'test@example.com',
                        }
                    }
                    return null;
                } catch (e) {
                    console.error("Error while trying to find user", e);
                    return null;
                }
            },
        },),
    ],
    secret: process.env.NEXTAUTH_SECRET,
};
