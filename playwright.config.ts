import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    //baseURL: "https://the-internet.herokuapp.com",
    trace: "on-first-retry"
  }
});
