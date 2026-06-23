import { existsSync, readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("app metadata", () => {
  const layoutSource = readFileSync(
    new URL("../../app/layout.tsx", import.meta.url),
    "utf8",
  );

  it("uses the Inkling page title", () => {
    expect(layoutSource).toContain('title: "Inkling"');
  });

  it("declares an Inkling browser icon", () => {
    expect(layoutSource).toContain('icon: "/inkling-icon.png"');
    expect(
      existsSync(new URL("../../public/inkling-icon.png", import.meta.url)),
    ).toBe(true);
  });
});
