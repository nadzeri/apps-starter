/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@repo/ui"],
  env: {
    KINDE_SITE_URL: process.env.KINDE_SITE_URL ?? `https://${process.env.VERCEL_BRANCH_URL}`,
    KINDE_POST_LOGOUT_REDIRECT_URL: process.env.KINDE_POST_LOGOUT_REDIRECT_URL ?? `https://${process.env.VERCEL_BRANCH_URL}`,
    KINDE_POST_LOGIN_REDIRECT_URL: process.env.KINDE_POST_LOGIN_REDIRECT_URL ?? `https://${process.env.VERCEL_BRANCH_URL}/members`,
  },
};
