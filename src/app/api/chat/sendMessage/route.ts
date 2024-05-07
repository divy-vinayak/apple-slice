import prisma from "@/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

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
                send_at: "asc",
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
            "Your name is Uncease AI bot, an advanced AI designed to provide expert information on dementia care. You bring an enthusiastic and positive energy to your quick-thinking, precise responses. Created by Team Uncease at IIT Kharagpur, you were fine-tuned with around 1,000 dementia-related questions and answers under the guidance of Dr. Ram Babu Roy. Only answer what is asked. Your response must be formatted in markdown.";

        if (patient) {
            systemMessageContent += `You should answer taking into consideration that you are answering for this patient: ${JSON.stringify(
                {
                    ...patient.patient,
                    caregiver_realtion:
                        "user i.e. the caregiver is " +
                        patient.patient?.caregiver_relation +
                        " of patient",
                    caregiver_shift_duration:
                        "Caregiver can spare " +
                        patient.patient?.caregiver_shift_duration +
                        " hours",
                }
            )}`;
        }

        systemMessageContent += " Only answer the last user message.";
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
        console.log({ messagesToSend });

        const res = await fetch(`https://api.openai.com/v1/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: messagesToSend,
                stream: true,
                temperature: 0.3,
            }),
        });

        // const res = await fetch(
        //     `${process.env.MODEL_SERVER_URL}/v1/chat/completions`,
        //     {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify({
        //             messages: messagesToSend,
        //             stream: true,
        //             use_context: true,
        //             temperature: 0.3
        //         }),
        //     }
        // );

        if (!res.ok) {
            const errorText = await res.text();
            return NextResponse.json(
                { error: errorText },
                { status: res.status }
            );
        }
        const reader = res.body?.getReader();
        if (!reader) {
            return NextResponse.json(
                { error: "Failed to create a reader for the response stream." },
                { status: 500 }
            );
        }

        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of streamGenerator(reader)) {
                    controller.enqueue(chunk);
                }
                controller.close();
            },
        });

        return new NextResponse(stream, {
            headers: {
                "Content-Type": "text/event-stream", // Set the content type to indicate a streaming response
            },
        });
    } catch (error) {
        console.error({ error });
        return NextResponse.json(
            { message: "Error Occured while sendMessage" },
            { status: 500 }
        );
    }
}

async function* streamGenerator(
    reader: ReadableStreamDefaultReader<Uint8Array>
) {
    while (true) {
        const { done, value } = await reader.read();
        if (done) break; // End of stream

        // Decode the Uint8Array chunk using TextDecoder
        const textDecoder = new TextDecoder();
        const chunk = textDecoder.decode(value);

        // Stream the chunk to the client
        yield chunk;
    }
}
