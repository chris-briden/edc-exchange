import Image from "next/image";

interface LogoProps {
  height?: number;
  showText?: boolean;
  textClassName?: string;
  variant?: "icon" | "shield";
}

export default function Logo({ height = 48, showText = true, textClassName = "", variant = "icon" }: LogoProps) {
  const src = variant === "shield" ? "/tcc-shield-logo.png" : "/tcc-icon.png";
  const imgWidth = variant === "shield" ? 850 : 620;
  const imgHeight = variant === "shield" ? 795 : 640;

  return (
    <div className="flex items-center gap-3">
      <Image
        src={src}
        alt="The Carry Collective"
        width={imgWidth}
        height={imgHeight}
        className="shrink-0"
        style={{ height: `${height}px`, width: "auto" }}
      />
      {showText && (
        <span className={`font-bold tracking-wide text-white ${textClassName}`}>
          The Carry Collective
        </span>
      )}
    </div>
  );
}

