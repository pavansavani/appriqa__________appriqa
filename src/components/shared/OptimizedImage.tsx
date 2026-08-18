import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImageProps, "alt"> {
  alt: string; // Enforce alt text as required
  containerClassName?: string;
}

export function OptimizedImage({
  src,
  alt,
  className,
  containerClassName, // no longer used, kept for API compatibility if needed
  ...props
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      className={cn("object-cover", className)}
      sizes={props.fill ? (props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw") : undefined}
      {...props}
    />
  );
}
