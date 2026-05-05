"use client";

type HomeCTAProps = {
  icon: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  bg: string;
  titleColor?: string;
  subtitleColor?: string;
  buttonBg?: string;
  buttonColor?: string;
};

export const HomeCTA = ({
  icon,
  title,
  subtitle,
  buttonLabel,
  bg,
  titleColor = "#fff",
  subtitleColor = "rgba(255,255,255,0.65)",
  buttonBg = "rgba(255,255,255,0.2)",
  buttonColor = "#fff",
}: HomeCTAProps) => {
  return (
    <div
      className="rounded-xl px-4 py-3.5 flex items-center justify-between"
      style={{ background: bg }}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-[10px] bg-white/[0.14] flex items-center justify-center text-[17px]">
          {icon}
        </div>
        <div>
          <div className="text-[13px] font-extrabold" style={{ color: titleColor }}>
            {title}
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: subtitleColor }}>
            {subtitle}
          </div>
        </div>
      </div>
      <button
        className="border-none rounded-lg px-3 py-1.5 text-[11px] font-semibold cursor-pointer"
        style={{ background: buttonBg, color: buttonColor }}
      >
        {buttonLabel}
      </button>
    </div>
  );
};
