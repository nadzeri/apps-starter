import { LogoutLink, getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Button } from "@repo/ui/button";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const { isAuthenticated } = getKindeServerSession();
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/");
  }
  return (
    <p>
      This is dashboard for authenticated user{" "}
      <Button asChild>
        <LogoutLink>Logout </LogoutLink>
      </Button>
    </p>
  );
}
