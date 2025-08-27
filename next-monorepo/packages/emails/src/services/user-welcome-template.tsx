import { Body, Column, Container, Head, Html, Img, Preview, Row, Section, Tailwind, Text } from "@react-email/components";
import { InterFont } from "../../components/inter-font";
import { createResend } from "./resend";

export const sendUserWelcome = async (args: Props) => {
  if (!!process.env.CI) {
    return;
  }

  const { userFirstName, userEmail, linkToApp } = args;

  const resend = createResend();

  const { data, error } = await resend.emails.send({
    from: "Awesome App <noreply@awesome.app>",
    to: userEmail,
    subject: "Your Awesome App profile is ready! Click to Begin",
    react: <UserWelcomeTemplate userFirstName={userFirstName} linkToApp={linkToApp} />,
  });

  return { data, error };
};

export function UserWelcomeTemplate(props: Omit<Props, "userEmail">) {
  const { userFirstName, linkToApp } = props;

  return (
    <Html>
      <Head>
        <InterFont />
      </Head>
      <Preview>Your Awesome App profile is ready!</Preview>
      <Tailwind>
        <Body className="font-inte mx-auto">
          <Container className="mx-auto w-full max-w-[650px]">
            <div className="py-[21px]">
              <Img src="https://rpfdupejhqfatxcljmzv.supabase.co/storage/v1/object/public/assets/logo-dark.png?t=2024-12-12T01%3A18%3A21.842Z" alt="logo" />
            </div>
            <Container className="max-w-[650px] rounded-[40px] bg-[#FCFAF8] px-8 py-10">
              <Section className="text-xl font-semibold">Your Awesome App profile is ready! </Section>
              <Section className="text-foreground text-sm font-normal">
                <Text>Hi {userFirstName},</Text>
                <Text>
                  Welcome to Awesome App! Your profile has been set up and you are now able to access the platform, set your availability and start providing
                  care to our members.
                </Text>
                <Text>
                  Please click&nbsp;
                  <a href={linkToApp} target="_blank" rel="noopener noreferrer">
                    here
                  </a>
                  &nbsp;to get started.
                </Text>
                <Text>
                  if you have any issues creating your account please contact us on <a href="mailto:customerservice@awesome.app">customerservice@awesome.app</a>
                </Text>
                <Text>Kind regards,</Text>
                <Text>Awesome App Team</Text>
              </Section>
            </Container>
            <Section className="text-muted-foreground mt-4 text-center text-xs font-medium">
              <Row>
                <Column>
                  <Row>www.awesome.app</Row>
                </Column>
                <Column>
                  <Row>Mail us at: customerservice@awesome.app</Row>
                </Column>
                <Column>
                  <Row>Call us at: 1800 Awesome App (1800 93 5976)</Row>
                </Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

interface Props {
  userFirstName: string;
  userEmail: string;
  linkToApp: string;
}
