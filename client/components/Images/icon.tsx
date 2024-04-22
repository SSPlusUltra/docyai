import Image, { StaticImageData } from "next/image"; // Import Image from Next.js

interface IconProps {
  src: StaticImageData;
  alt: string;
}

const Icon: React.FC<IconProps> = ({ src, alt }) => {
  return <Image src={src} alt={alt} />;
};

export default Icon;
