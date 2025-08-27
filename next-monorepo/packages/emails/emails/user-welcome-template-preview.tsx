import * as React from "react";
import { UserWelcomeTemplate } from "../src/services";

export default function UserWelcomeTemplatePreview() {
  return <UserWelcomeTemplate userFirstName="John" linkToApp="https://google.com" />;
}
