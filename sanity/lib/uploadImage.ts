import "server-only";

type UploadClient = {
  assets: {
    upload: (
      type: "image",
      body: Buffer,
      options?: { filename?: string; contentType?: string },
    ) => Promise<{ _id: string }>;
  };
};

export type UploadedImage = {
  _type: "image";
  asset: {
    _type: "reference";
    _ref: string;
  };
  alt?: string;
  caption?: string;
};

export function isUsableImageFile(file: unknown): file is File {
  return file instanceof File && file.size > 0 && file.type.startsWith("image/");
}

export async function uploadImageAsset(
  client: UploadClient,
  file: File,
  options?: {
    alt?: string;
    caption?: string;
  },
): Promise<UploadedImage> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const asset = await client.assets.upload("image", buffer, {
    filename: file.name || "travellers-diary-image",
    contentType: file.type || undefined,
  });

  return {
    _type: "image",
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
    ...(options?.alt ? { alt: options.alt } : {}),
    ...(options?.caption ? { caption: options.caption } : {}),
  };
}
