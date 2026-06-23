import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("global CSS reset", () => {
  it("does not override Tailwind spacing utilities outside a cascade layer", () => {
    const css = readFileSync(
      new URL("../../app/globals.css", import.meta.url),
      "utf8",
    );
    const universalRule = css.match(/\*\s*\{([^}]*)\}/)?.[1] ?? "";

    expect(universalRule).not.toMatch(/\b(?:margin|padding)\s*:/);
  });
});
