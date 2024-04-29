import prisma from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { OpenAI } from "openai-streams";
import { StreamingTextResponse } from "ai";

export async function POST(request: Request) {
    try {
        const session = await getServerSession();
        if (!session) {
            redirect("/api/auth/signin");
        }
        const user = session.user;
        const userDb = await prisma.user.findFirst({
            where: {
                email: user?.email?.toString(),
            },
        });
        const requestBody = await request.json();
        const {
            chatId,
            newMessage,
        }: {
            chatId: string;
            newMessage: {
                role: string;
                content: string;
            };
        } = requestBody;
        const chatDb = await prisma.chats.findFirst({
            where: {
                user_id: userDb?.id,
                id: chatId,
            },
        });
        if (!chatDb) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const newMessageDb = await prisma.messages.create({
            data: {
                sent_by_user: newMessage.role === "user",
                message: newMessage.content,
                chat_id: chatDb.id,
            },
        });

        const last50Messages = await prisma.messages.findMany({
            where: {
                chat_id: chatDb.id,
            },
            orderBy: {
                send_at: "desc",
            },
            take: 50,
        });

        if (last50Messages.length === 1) {
            const TitleOfChatDb = await prisma.chats.update({
                where: {
                    id: chatDb.id,
                },
                data: {
                    title: newMessage.content.slice(0, 40),
                },
            });
            if (!TitleOfChatDb) {
                console.error("Could not add title to chat");
            }
        }

        // get patient associated with this chat
        const patient = await prisma.chats.findFirst({
            where: {
                user_id: userDb?.id,
                id: chatDb.id,
            },
            select: {
                patient: {
                    select: {
                        name: true,
                        sex: true,
                        age: true,
                        description: true,
                        dementiaTypes: {
                            select: {
                                type: true,
                            },
                        },
                        dementia_stage: true,
                        country: {
                            select: {
                                name: true,
                            },
                        },
                        other_conditions: true,
                        caregiver_relation: true,
                        caregiver_shift_duration: true,
                    },
                },
            },
        });

        // system message
        let systemMessageContent =
            "Your name is Uncease AI bot. You are designed to provide information to people about dementia care. You are an incredibly intelligent and quick-thinking AI, that always replies with an enthusiastic and positive energy. You were created by Team Uncease, a group of students from IIT Kharagpur as part of their BTP project under professor Dr. Ram Babu Roy. Your response must be formatted as markdown. You must not mention any sources from the context doc provided to you. Use it only for internal reference. You should say you have been fine tuned with around a 1000 question and answers to dementia related topics. You must keep your responses precise and upto the mark and as small as possible. Try to stay within 200 words.";
            
        if(patient){
            systemMessageContent += `You should answer taking into consideration that you are answering for this patient: ${JSON.stringify(patient)}`
        }
        const systemMessage: {
            role: "system" | "assistant" | "user";
            content: string;
        } = {
            role: "system",
            content: systemMessageContent,
        };

        // send last50Messages to the model
        const messagesToSend: {
            role: "system" | "assistant" | "user";
            content: string;
        }[] = last50Messages.map((message) => {
            return {
                role: message.sent_by_user ? "user" : "assistant",
                content: message.message,
            };
        });
        messagesToSend.unshift(systemMessage);

        // after stream ends... add the reponse message to db
        console.log({ messagesToSend });
        const stream = await OpenAI(
            "chat",
            {
                model: "mistral-7b",
                messages: messagesToSend,
            },
            {
                apiBase: process.env.MODEL_SERVER_URL,
                apiKey: process.env.OPENAI_API_KEY || "",
            }
        );

        console.log({ stream });
        return new StreamingTextResponse(stream);
    } catch (error) {
        console.error({ error });
        return NextResponse.json(
            { message: "Error Occured while sendMessage" },
            { status: 500 }
        );
    }
}
