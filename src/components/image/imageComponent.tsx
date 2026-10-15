import { Image } from "next-sanity/image";
import { urlFor } from "./sanityImageUrl";

type ImageComponentProps = {
  width: number;
  height: number;
  image: {
    asset: {
      _id: string;
      url: string;
      metadata: {
        lqip: string | null;
      } | null;
    } | null;
    caption?: string;
    _key: string;
  };
  sizes: string;
};

function ImageComponent({ image, width, height, sizes }: ImageComponentProps) {
  if (!image.asset?.metadata?.lqip) return null;
  return (
    <Image
      id={image.asset._id}
      src={urlFor(image).width(800).url()}
      key={image._key}
      width={width}
      height={height}
      alt={image.caption || "Image"}
      sizes={sizes}
    />
  );
}
export default ImageComponent;
