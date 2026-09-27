import Image from "next/image";
import { mediaSrc } from "@/lib/api";
import type { MediaRef } from "@/lib/types";

export default function MediaFrame({
  media,
  label,
  priority = false,
}: {
  media: MediaRef | null;
  label: string;
  priority?: boolean;
}) {
  if (!media || media.missing) {
    return (
      <div className="placeholder" role="img" aria-label={`${label} unavailable`}>
        {label} not on disk yet
      </div>
    );
  }

  if (media.kind === "video") {
    return (
      <video className="media-frame" src={mediaSrc(media.url)} controls playsInline preload="metadata">
        {label}
      </video>
    );
  }

  if (media.kind === "audio") {
    return <audio className="media-audio" src={mediaSrc(media.url)} controls />;
  }

  const src = mediaSrc(media.thumbUrl || media.url);
  return (
    <Image
      className="media-frame"
      src={src}
      alt={media.caption || label}
      width={1200}
      height={800}
      priority={priority}
      unoptimized
    />
  );
}
