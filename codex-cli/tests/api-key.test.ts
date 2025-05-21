import { describe, it, expect, beforeEach, afterEach } from "vitest";

// We import the module *lazily* inside each test so that we can control the
// OPENAI_API_KEY env var independently per test case. Node's module cache
// would otherwise capture the value present during the first import.

const ORIGINAL_ENV_KEY = process.env["OPENAI_API_KEY"];

beforeEach(() => {
  delete process.env["OPENAI_API_KEY"];
});

afterEach(() => {
  if (ORIGINAL_ENV_KEY !== undefined) {
    process.env["OPENAI_API_KEY"] = ORIGINAL_ENV_KEY;
  } else {
    delete process.env["OPENAI_API_KEY"];
  }
});

describe("config.setApiKey", () => {
  it("overrides the exported OPENAI_API_KEY at runtime", async () => {
    const { setApiKey, OPENAI_API_KEY } = await import(
      "../src/utils/config.js"
    );

    expect(OPENAI_API_KEY).toBe("");

    setApiKey("my‑key");

    const { OPENAI_API_KEY: liveRef } = await import("../src/utils/config.js");

    expect(liveRef).toBe("my‑key");
  });
});

describe("config.getApiKey provider env", () => {
  const ORIGINAL_DEEPSEEK = process.env["DEEPSEEK_API_KEY"];

  beforeEach(() => {
    process.env["DEEPSEEK_API_KEY"] = "test-key";
  });

  afterEach(() => {
    if (ORIGINAL_DEEPSEEK !== undefined) {
      process.env["DEEPSEEK_API_KEY"] = ORIGINAL_DEEPSEEK;
    } else {
      delete process.env["DEEPSEEK_API_KEY"];
    }
  });

  it("reads provider specific API key", async () => {
    const { getApiKey } = await import("../src/utils/config.js");
    expect(getApiKey("deepseek")).toBe("test-key");
  });
});
