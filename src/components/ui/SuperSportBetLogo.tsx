type SuperSportBetLogoProps = {
  className?: string;
  height?: number | string;
  alt?: string;
};

const LOGO_SRC =
  "https://imagedelivery.net/Vd-cIddpsfJ7XHHMXJuIbA/b5f2943f-a232-4715-c4d2-7c3b256dfe00/public";

export const SuperSportBetLogo = ({
  className,
  height = 20,
  alt = "SuperSportBET",
}: SuperSportBetLogoProps) => {
  return (
    <img
      src={LOGO_SRC}
      alt={alt}
      height={typeof height === "number" ? height : undefined}
      style={{ height, width: "auto" }}
      className={`inline-block object-contain select-none ${className ?? ""}`.trim()}
      decoding="async"
      loading="eager"
      draggable={false}
    />
  );
};
