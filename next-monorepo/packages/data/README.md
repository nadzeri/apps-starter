# AwesomeApp Data Packages

## Stripe

### 3DS Exemption

3DS is a part of Strong Customer Authentication (SCA), which is fully enforced in European countries and requires users to authenticate payments with OTP.

This will be a challenge for us when processing payments through back-office or clinician app. To address this, we can request a 3DS exemption by marking payments as off-session:

```typescript
const paymentIntent = await stripeClient.paymentIntents.create({
    ...
    off_session: true,
})
```

Important considerations:

- The final decision for 3DS exemption lies with the cardholder's bank
- If the bank requires 3DS authentication, off-session payments will fail
- Alternatively, we can implement 3DS flow in the members app, but this requires handling stale payments when users don't complete authentication

Reference link:

- https://stripe.com/guides/strong-customer-authentication
- https://support.stripe.com/questions/what-is-the-difference-between-on-session-and-off-session-and-why-is-it-important#:~:text=%E2%80%9COn%20session%E2%80%9D%20is%20when%20the,automatically%20or%20by%20the%20merchant

### Automated Receipt

To enable automated receipts, toggle Successful payments on in your Customer emails settings. Receipts are only sent when a successful payment has been made—no receipt is sent if the payment fails or is declined.
https://dashboard.stripe.com/settings/emails

## Production Database SSL Enforcement

1. Enable SSL in Supabase

   - Go to Database Settings in Supabase Dashboard
   - Enable SSL Enforcement

2. Set up SSL Certificate

   - Download the SSL certificate from Supabase
   - Convert to base64:
     ```
     cat supabase-ca.pem | base64
     ```
   - Add to environment variables:
     ```
     SUPABASE_CA_CERT=<base64_encoded_certificate>
     ```

3. Configure Postgres Connection
   ```typescript
   globalConnection.connection = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.SUPABASE_CA_CERT
      ? {
          ca: Buffer.from(process.env.SUPABASE_CA_CERT, "base64").toString(),
          requestCert: true,
          rejectUnauthorized: true,
        }
      : false,
   });
   ```
4. Adjust drizzle.config.ts
   ```typescript
   dbCredentials: {
    url,
    host,
    database,
    user,
    password,
    port: process.env.NODE_ENV === "production" ? 5432 : port, // seems for push using the port from the database url we are using is not working for the prod instant we are using.
    ssl: process.env.SUPABASE_CA_CERT
    ? {
        requestCert: true,
        rejectUnauthorized: true,
        ca: Buffer.from(process.env.SUPABASE_CA_CERT!, "base64").toString(),
      }
    : false
   }
   ```

### Steps to Enforce SSL to Minimize Distruption

1. Download certificate from Supabase Production's Database
2. Update Environment Variables
   - Add `SUPABASE_CA_CERT` that contains encoded certificate
3. Merge code changes to Production
4. Make sure DB connection is working on Production

## Switching Database Driver to node-postgres

### Background

Previously, we encountered issues using `postgres-js` with Supavisor connections. Specifically, we experienced timeouts when executing complex queries under even a small amount of traffic.

### Exploration and Findings

To identify the root cause, we conducted an exploration and found that switching to `node-postgres` significantly improved performance. Below are the results of our load tests using Grafana's k6 tool:

1. **Scenario 1: `postgres-js` + Supavisor connection**

- 20 users for 90 seconds
- Only 79% of requests returned HTTP 200, with the rest timing out
- p90 latency: 90 seconds

2. **Scenario 2: `postgres-js` + direct connection**

- 20 users for 90 seconds
- All requests returned HTTP 200
- p90 latency: 8.71 seconds

3. **Scenario 3: `node-postgres` + Supavisor connection**

- 20 users for 90 seconds
- All requests returned HTTP 200
- p90 latency: 4.68 seconds

Test are conducted from local environment hitting preproduction database. Based on these results, we decided to further test `node-postgres` with Supavisor due to its promising performance. Using direct connections with `postgres-js` was not a viable option for our serverless architecture.

### Additional Testing

We deployed the changes to the Preview environment and ran a staged load test using k6:

- **Stage 1:** Ramp up to 20 users over 1 minute
- **Stage 2:** Increase to 30 users over 1 minute
- **Stage 3:** Maintain 30 users for 1 minute
- **Stage 4:** Ramp down to 0 users over 1 minute

**Results:**

- 5865 requests completed in 4 seconds with no timeouts
- p90 latency: 278ms, max latency: 2 seconds
- Supavisor connections peaked at 75

### Observations

We noticed that Supavisor connections are not released as quickly as expected, though the situation has improved. As we scale, we may need to:

- Upgrade the Supabase instance to handle more Supavisor connections
- Explore better solutions for faster connection release or reuse.
