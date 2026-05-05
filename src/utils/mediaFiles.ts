const IMAGE_FILE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "svg",
  "bmp",
  "tiff",
  "avif",
  "jfif",
]);

export const getFileExtension = (...values: Array<string | null | undefined>) => {
  for (const value of values) {
    if (!value) continue;
    const normalized = value.trim().toLowerCase();
    if (!normalized) continue;

    const withoutQuery = normalized.split("?")[0].split("#")[0];
    const lastSegment = withoutQuery.split("/").pop() || withoutQuery;
    const extension = lastSegment.includes(".")
      ? lastSegment.slice(lastSegment.lastIndexOf(".") + 1)
      : lastSegment.replace(/^\./, "");

    if (extension) return extension;
  }

  return "";
};

export const isImageFileType = (...values: Array<string | null | undefined>) => {
  const extension = getFileExtension(...values);
  return IMAGE_FILE_EXTENSIONS.has(extension);
};

export { IMAGE_FILE_EXTENSIONS };
