import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppPhoneFrame } from "./AppPhoneFrame";

describe("AppPhoneFrame", () => {
  it("renders the shared app phone frame classes", () => {
    render(<AppPhoneFrame>Frame Content</AppPhoneFrame>);

    const frame = screen.getByTestId("app-phone-frame");
    expect(frame).toHaveTextContent("Frame Content");
    expect(frame).toHaveClass(
      "modal",
      "scroll-touch",
      "w-full",
      "max-w-[360px]",
      "sm:max-w-[390px]",
      "md:max-w-[420px]",
      "lg:max-w-[460px]",
    );
  });
});
