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
        src="/logo.png"
        alt="The Carry Exchange"
        width={Math.round(height * 3.5)}
        height={height}
        className="shrink-0 object-contain"
      />
    </div>
  );
}

