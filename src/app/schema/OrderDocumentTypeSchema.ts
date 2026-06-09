import * as Yup from "yup";

export const ORDER_DOCUMENT_EXTENSION_OPTIONS = [
  { key: "pdf", label: "PDF (.pdf)" },
  { key: "jpg", label: "JPG Image (.jpg)" },
  { key: "jpeg", label: "JPEG Image (.jpeg)" },
  { key: "png", label: "PNG Image (.png)" },
  { key: "webp", label: "WEBP Image (.webp)" },
  { key: "gif", label: "GIF Image (.gif)" },
  { key: "docx", label: "Word Document (.docx)" },
  { key: "xlsx", label: "Excel Workbook (.xlsx)" },
  { key: "xls", label: "Excel 97-2003 Workbook (.xls)" },
  { key: "pptx", label: "PowerPoint Presentation (.pptx)" },
  { key: "zip", label: "ZIP Archive (.zip)" },
];

const allowedExtensions = ORDER_DOCUMENT_EXTENSION_OPTIONS.map(
  (option) => option.key
);

export const normalizeSupportedExtensions = (
  value?: string[] | string | null
): string[] => {
  if (!value) return [];

  const values = Array.isArray(value) ? value : value.split(",");

  const extensions = values
    .map((item) => item.trim().replace(/^\.+/, "").toLowerCase())
    .filter((item) => allowedExtensions.includes(item));

  return Array.from(new Set(extensions));
};

const normalizeExtensionValues = (
  value?: string[] | string | null
): string[] => {
  if (!value) return [];

  const values = Array.isArray(value) ? value : value.split(",");

  const extensions = values
    .map((item) => item.trim().replace(/^\.+/, "").toLowerCase())
    .filter(Boolean);

  return Array.from(new Set(extensions));
};

export const getFileExtension = (fileName: string): string =>
  fileName.split(".").pop()?.toLowerCase() ?? "";

export const isFileExtensionAllowed = (
  fileName: string,
  supportedExtensions?: string[] | null
): boolean => {
  const extensions = normalizeExtensionValues(supportedExtensions);
  if (!extensions.length) return true;

  return extensions.includes(getFileExtension(fileName));
};

export const getSupportedExtensionsLabel = (
  supportedExtensions?: string[] | null
): string => {
  const extensions = normalizeExtensionValues(supportedExtensions);
  if (!extensions.length) return "Any file type";

  return extensions.map((extension) => `.${extension}`).join(", ");
};

export const OrderDocumentTypeSchema = Yup.object().shape({
  Name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must be 255 characters or less")
    .required("Name is required"),
  IsRequired: Yup.boolean().required(),
  SupportedExtensions: Yup.array()
    .of(
      Yup.string().oneOf(
        allowedExtensions,
        "Select a valid supported extension"
      )
    )
    .default([]),
});
