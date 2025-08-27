# Awesome App 😍

[![Member E2E](https://github.com/we-lysn/frontend/actions/workflows/tests-e2e-members.yml/badge.svg)](https://github.com/we-lysn/frontend/actions/workflows/tests-e2e-members.yml)

The next generation Awesome App frontend is constructed entirely from Next.js and hosted on the revolutionary Vercel platform.

You can access (member app) preproduction any time at: https://preproduction-awesomeapp-members.vercel.app/members

## Project Structure

The project is structured as follows:

- `apps`: contains all apps that are part of the Awesome App platform
  - `members`: The members app for users to view and manage their consultation sessions.
  - `clinicians`: The clinicians app is used by clinicians to view and manage session that have been created by users.
  - `back-office`: The back office app is used by Awesome App staff.
  - `notification-api`: The notification api is used to send recurring notification to users.
  - `eap-partners`: Dashboard for the EAP Partners.
- `packages`: contains all the shared packages that are used across the different apps
  - `data`: contains all the data models, data access functions, migration scripts, and utilities.
  - `emails`: contains all the email templates.
  - `ui`: contains all the UI components.


## Running Locally

### Prerequisites
- Install [pnpm](https://pnpm.io/installation)
- Install [turbo](https://turbo.dev/docs/installation) globally by running `pnpm install turbo --global`
- Install [docker](https://docs.docker.com/get-docker/)
- Install [supabase](https://github.com/supabase/cli#installation) by running `brew install supabase/tap/supabase`
- Install [vercel](https://vercel.com/docs/cli#installation) globally by running `pnpm install vercel --global`
- Get access to Supabase, Vercel, and Kinde

### Supabase

We use Supabase to run our PostgreSQL database. You can read more about Supabase here: https://supabase.com/docs

Once Supabase installed locally, you should be able to access the Supabase Studio at `http://localhost:54323/` and see the database schema and data.

Setting up Supabase in your local:

- Go inside the data package folder at `packages/data`
- Make sure you have install docker and running
- Run `supabase start`
- Now going to `http://localhost:54323/` you should see the supabase admin panel
- Also if you run `supabase status` you should see the `DB URL`
- Make sure to update the value of `DATABASE_URL` in the `.env.local` file with the value of `DB URL` from the `supabase status` command
- Run `pnpm db:migrate` to push latest schema to the local db
- Run `pnpm db:local:seed` to run the seed data in `data/scripts/seed.sql`



> There are some github issue about feature parity between the local supabase and the cloud version, so some features might not work as expected, lucky for us we are mainly using supabase for db locally, which just postgres

### Start Development Server

Now, to start the development server, run:

    turbo dev

This will run all apps in the monorepo, alternatively you can run the app individually by first navigating to the app directory and running:

    turbo dev


### Start App Individually

You can start an app individually by first navigating to the app directory.

However you need to make sure .env.local is available. You can do that by pulling from Vercel:
- Make sure you have vercel installed globally, if not run `pnpm install vercel --global`
- Make sure you already have access to Vercel
- Login to vercel using your account `vercel login`
- Link your local project to Vercel `vercel link` remember to choose AwesomeApp scope in case your account tied to multipe organizations
- Link your project to `awesomeapp/<app-name>`
- Pull development env file to your local `vercel env pull .env.local`
- Make sure `.env.local` file is created on individual app directory (e.g. `apps/members`) and run `turbo dev`


> Tips: You can run `tsc --watch` in `packages/data` during development to see the changes in the data layer since `turbo dev` won't watch the data layer.

### User Access to Applications

#### Access to Member app
- Start the Back Office application: `turbo dev` inside `apps/members` directory.
- Open your browser and go to http://localhost:3000.
- On the first launch, the app will prompt you for a password. Use the value of `PRE_LAUNCH_PASSWORD` from the .env.local file in apps/members.
- Complete the registration process to gain access to the Member application

#### Access to Back Office app
- Start the Clinician application: `turbo dev` inside `apps/back-office` directory.
- Open your browser and go to http://localhost:3002.
- Initially after authentication, you will be redirected to an "Account Not Found" page.
- To gain access, manually add an entry to the `awesomeapp_staff` table in your local Supabase database with `noii_id` from your Kinde User ID (under the Development environment).
- Once added, you will be able to access the Back Office application

#### Access to Clinician app
- Start the Clinician application: `turbo dev` inside `apps/clinicians` directory.
- Open your browser and go to http://localhost:3001.
- Initially after authentication, you will be redirected to an "Account Not Found" page.
- To gain access, you can add a clinician in the Back Office application by using your email.
- Once added, you will be able to access the Clinician application

#### Access to EAP Partner app
- Start the Clinician application: `turbo dev` inside `apps/eap-partners` directory.
- Open your browser and go to http://localhost:3004.
- Initially after authentication, you will be redirected to an "Account Not Found" page.
- To gain access, manually add an entry to the `eap_partners` table in your local Supabase database with `noii_id` from your Kinde User ID (under the Development environment).
- Next, add an entry to the `eap_partners_access` table with the following values:
  - `eap_partner_id`: Retrieved from the `id` in the `eap_partners` table.
  - `eap_company`: Retrieved from the `id` in the `companies` table.
- Once these entries are added, you will be able to access the EAP Partner application.

and that's it! You should be up and running, welcome to the Awesome App dev team 🥳

## Feature flags

We're using Posthog feature flags.

- Non-production : https://us.posthog.com/project/79104/feature_flags?tab=overview
- Production: https://us.posthog.com/project/130199/feature_flags?tab=overview

Currently we have different way to read feature flags depending if you're in the server side or client side.

### Client

Using [React SDK] (https://posthog.com/docs/libraries/react)

### Server

For some reason, `posthog-node` SDK doesn't really work well with NextJS (worth revisiting this in the future) as we kept getting old value of the feature flag when we tried this, as a temporary solution, we're using the [REST API](https://posthog.com/docs/api/feature-flags#get-api-projects-project_id-feature_flags). This required us to generate a `Personal API Key`, you can find it [here](https://us.posthog.com/project/79104/settings/user-api-keys). It only has read access to feature flags, and it's organization wide and can be used in both development and production Posthog environment.

The API call is abstracted in `package/data/services/posthog.ts` `getServerSideFeatureFlag` method

## E2E Testing

We use [Playwright](https://playwright.dev/) for end-to-end testing. Install it with `pnpm install` if you don't have it already.

We do test by each app, you may want to direct to apps/<app name> folder first, then go to end-to-end testing script folder (e.g., e2e)

If no end-to-end test yet, you can initite one inside your app folder by running this command

```bash
pnpm create playwright # this will do initial config and folder structures
```

For further explanation about how end-to-end testing works with our apps, please refer to the [E2E Explained](/docs/e2e-explained.md) document.

### Running E2E Tests on an Application

1. Navigate to `playwright.config.ts` in the app folder (e.g., `apps/members/playwright.config.ts`).
2. Update the `DATABASE_URL` in the `webServer`'s `env` object to your local database URL from `.env.local`.
3. Added this field `CI=true` in the app's `.env.local`. Revert or remove them later after the test is completed.
    - (Optional) In `packages/data/src/services/kinde.ts`, update the `getUserFake` function with your user ID and email for easier debugging. Revert changes after testing.
5. Build the app with `turbo build`.
6. Run the tests with `pnpm run test:e2e:ui`.
7. Use the UI to run tests and view results.

*Note: Environment variables defined inside the playwright config file (playwright.config.ts) will still be overwritten by the environment variables defined inside the local .env file, so to be safe please still update your local .env accordingly when you want to run the E2E test locally*

### Running E2E Tests Locally with GitHub Workflow

Create `.secrets` file by running the command below. Complete the values, you can google how to find those values by searching its name

```bash
cp .secrets.example .secrets
```

Use [nektos/act](https://github.com/nektos/act) to run GitHub workflows locally:

```bash
act --container-architecture=linux/amd64 -W .github/workflows/<your-e2e-test-file>.yml
```

### Creating a New E2E Test with Playwright Codegen

1. Start the app with `turbo dev` or `turbo start`.
2. Create a new test file in the `e2e` folder (e.g., `booking.spec.ts`).
3. Run `pnpm run test:codegen`.
4. In the spawned browser, open the local app and start recording interactions. You can also use the app started in playwright testing.
5. Copy the generated code to your new test file.
6. Run the E2E test to ensure it works correctly.

For more details on Playwright codegen, refer to the [official documentation](https://playwright.dev/docs/codegen).
 

