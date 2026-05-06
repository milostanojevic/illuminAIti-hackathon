import React from "react";

export const AppPhoneFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="modal scroll-touch w-full max-w-[360px] sm:max-w-[390px] md:max-w-[420px] lg:max-w-[460px]"
      data-testid="app-phone-frame"
    >
      {children}
    </div>
  );
};
