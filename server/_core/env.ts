export const ENV = {
  // Fallbacks: em ambientes fora da Manus (ex.: Hostinger) essas envs nao
  // sao injetadas; valores oficiais do app deste projeto (HOSTINGER-DEPLOY.md).
  appId: process.env.VITE_APP_ID ?? "6EwoPvwoUEAd368Wyozqqt",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "https://api.manus.im",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};
