import { createServerFn } from "@tanstack/react-start";

export const runResearch = createServerFn({ method: "POST" })
  .inputValidator((input: { categories?: string[] } | undefined) => input ?? {})
  .handler(async ({ data }) => {
    const { researchAgent } = await import("./agents.server");
    return researchAgent(data.categories);
  });

export const runWriter = createServerFn({ method: "POST" })
  .inputValidator((input: { topicSeed?: string; count?: number; categories?: string[] } | undefined) => input ?? {})
  .handler(async ({ data }) => {
    const { writerAgent } = await import("./agents.server");
    return writerAgent(data);
  });

export const runReports = createServerFn({ method: "POST" })
  .inputValidator(() => ({}))
  .handler(async () => {
    const { reportsAgent } = await import("./agents.server");
    return reportsAgent();
  });

export const runSocial = createServerFn({ method: "POST" })
  .inputValidator(() => ({}))
  .handler(async () => {
    const { socialAgent } = await import("./agents.server");
    return socialAgent();
  });
