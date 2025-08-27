import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@repo/ui/card";
import { api } from "../trpc/server";
import TempClient from "./components/temp-client";
import { Button } from "@repo/ui/button";
import { RegisterLink, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { match } from "ts-pattern";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const dynamic = "force-dynamic";

export default async function Page() {
  const fromServer = await api.temp.first.query();
  const users = await api.users.getUsers.query();
  const { isAuthenticated } = getKindeServerSession();
  const authenticated = await isAuthenticated();
  return (
    <>
      <header className="flex justify-end gap-4">
        {match(authenticated)
          .with(true, () => (
            <Button asChild>
              <LogoutLink>Logout </LogoutLink>
            </Button>
          ))
          .with(false, () => (
            <>
              <Button asChild>
                <RegisterLink>Register </RegisterLink>
              </Button>
              <Button asChild>
                <LoginLink>Login </LoginLink>
              </Button>
            </>
          ))
          .exhaustive()}
      </header>
      <main className="mt-40 flex justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Next Template</CardTitle>
            <CardDescription>Copy when creating a new app.</CardDescription>
          </CardHeader>
          <CardContent>
            <div>From Server: {fromServer}</div>
            <TempClient />
            <div>Users: {JSON.stringify(users, null, 2)}</div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
