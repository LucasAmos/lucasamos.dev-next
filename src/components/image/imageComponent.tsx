import { urlFor } from "./sanityImageUrl";
import Image from "next/image";

type ImageComponentProps = {
  width: number;
  height: number;
  image: {
    asset: {
      url: string;
      metadata: {
        lqip: string | null;
      } | null;
    } | null;
    caption?: string;
    _key: string;
  };
};

function ImageComponent({ image, width, height }: ImageComponentProps) {
  if (!image.asset?.metadata?.lqip) return null;
  return (
    <Image
      key={image._key}
      width={width}
      height={height}
      src={urlFor(image).url()}
      placeholder="blur"
      blurDataURL={image.asset.metadata.lqip}
      alt={image.caption || "Image"}
    />
  );
}
export default ImageComponent;
