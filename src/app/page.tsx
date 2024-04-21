import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession();
  console.log({user: session?.user})
  if (session) {
    redirect('/chat')
  }
  return (
    <h1>This is homepage</h1>
  );
}
