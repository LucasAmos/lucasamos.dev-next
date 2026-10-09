"use client"
import { SanityImage } from "sanity-image"

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

function ImageComponent({ image, width, height }: ImageComponentProps) {
  if (!image.asset?.metadata?.lqip) return null;
  return (
    <SanityImage
      id={image.asset._id}
      projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
      dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
      key={image._key}
      width={width}
      height={height}
      preview={image.asset.metadata.lqip}
      alt={image.caption || "Image"}
      sizes={sizes} />
  );
}
export default ImageComponent;
