import { describe, expect, it } from "vitest";

import { api } from "./apiClient";

describe("apiClient error normalization", () => {
  it("extracts message and code from the server error envelope", async () => {
    const adapter = async (config) => {
      const error = new Error("Request failed");
      error.config = config;
      error.response = {
        status: 401,
        data: {
          success: false,
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid credentials",
          },
        },
        config,
        headers: {},
      };
      throw error;
    };

    await expect(
      api.post("/auth/login", {}, { adapter }),
    ).rejects.toMatchObject({
      message: "Invalid credentials",
      code: "INVALID_CREDENTIALS",
      status: 401,
    });
  });
});
