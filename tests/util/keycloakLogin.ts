import { Page, expect } from "@playwright/test";

/* Ideally these would be sourced from the testing environment, but constants are fine too. */
const USERNAME = "janedoe";
const PASSWORD = "jane";

/** Attempts to log into a fresh Keycloak page using a hard-coded username/password, or the one specified in the call. */
export async function testUtilKeycloakLogin(props: { page: Page; username?: string; password?: string }) {
  const { page, username = USERNAME, password = PASSWORD } = props;
  
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Username or email").fill(username);
  await page.getByLabel("Password").fill(password);
  const submitButton = page.getByRole("button", { name: "Sign In" });
  await submitButton.click();
  await expect(submitButton).not.toBeVisible();
}
