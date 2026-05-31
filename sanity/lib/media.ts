import { urlFor } from "./image";

type ImageAsset = {
  _ref?: string;
  _id?: string;
  url?: string | null;
};

type ImageSource = {
  asset?: ImageAsset | null;
};

export function resolveImageUrl(source?: ImageSource | null, width = 1600) {
  if (!source) return "";

  if (source.asset?._ref || source.asset?._id) {
    try {
      return urlFor(source).width(width).quality(92).url();
    } catch {
      return source.asset?.url ?? "";
    }
  }

  return source.asset?.url ?? "";
}
