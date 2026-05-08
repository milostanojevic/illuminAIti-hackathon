import React from "react";

export const AppPhoneFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="modal scroll-touch w-full max-w-[430px]"
      data-testid="app-phone-frame"
    >
      {children}
    </div>
  );
};
