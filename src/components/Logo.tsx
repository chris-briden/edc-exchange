import Image from "next/image";

interface LogoProps {
  height?: number;
  showText?: boolean;
  textClassName?: string;
}

export default function Logo({ height = 48, showText = true, textClassName = "" }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/icon-new-white.png"
        alt="The Carry Exchange"
        width={568}
        height={556}
        className="shrink-0"
        style={{ height: `${height}px`, width: `${height}px` }}
      />
      {showText && (
        <span className={`font-bold tracking-wide text-white ${textClassName}`}>
          The Carry Exchange
        </span>
      )}
    </div>
  );
}

