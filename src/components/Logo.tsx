import Image from "next/image";

interface LogoProps {
  size?: number;
  showText?: boolean;
  textClassName?: string;
}

export default function Logo({ size = 36, showText = true, textClassName = "" }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/logo.svg"
        alt="EDC Exchange"
        width={size}
        height={size}
        className="shrink-0"
      />
      {showText && (
        <span className={`font-bold ${textClassName}`}>
          EDC Exchange
        </span>
      )}
    </div>
  );
}