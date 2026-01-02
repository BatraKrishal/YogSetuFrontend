import Image from "next/image";

export const RotatingRangoli = ({ className = "" }) => {
  return (
    <div>
      <Image
        src="/svgs/Rangoli.svg"
        alt="Rangoli"
        width={500}
        height={500}
        className={`will-change-transform ${className}`}
      />
    </div>
  );
};
