export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
// Optional returnPath: after OAuth callback, redirect user to this path instead of "/"
export const getLoginUrl = (returnPath?: string) => {
  // Fallback para quando as envs de OAuth não são injetadas no build
  // (ex.: Hostinger). Valores oficiais do app Manus deste projeto.
  const oauthPortalUrl =
    import.meta.env.VITE_OAUTH_PORTAL_URL || "https://manus.im";
  const appId = import.meta.env.VITE_APP_ID || "6EwoPvwoUEAd368Wyozqqt";
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  // Encode both redirectUri and returnPath in state
  const statePayload = returnPath
    ? JSON.stringify({ redirectUri, returnPath })
    : btoa(redirectUri);
  const state = returnPath ? btoa(statePayload) : btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
