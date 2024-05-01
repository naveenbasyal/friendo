import { Button } from "@/components/ui/button";
import { getSession, logout } from "@/lib/lib";
import { UserType } from "@/types";
import { redirect } from "next/navigation";

export default async function Home() {
  const { _doc: session } = await getSession();
  console.log("sesssion", session);

  if (!session) return <div>Not logged in</div>;

  return <div>Hello {session.username}</div>;
}
