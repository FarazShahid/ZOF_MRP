import {
  FaFilePdf,
  FaFileWord,
  FaFileImage,
  FaFileArchive,
  FaFileAlt,
  FaFileExcel,
  FaFilePowerpoint,
} from "react-icons/fa";

export const getFileIcon = (type: string) => {
  if (type.startsWith("image/"))
    return <FaFileImage className="text-blue-400" />;
  if (type === "application/pdf") return <FaFilePdf className="text-red-500" />;
  if (type.includes("word")) return <FaFileWord className="text-blue-600" />;
  if (type.includes("excel")) return <FaFileExcel className="text-green-600" />;
  if (type.includes("presentation"))
    return <FaFilePowerpoint className="text-orange-500" />;
  if (type.includes("zip"))
    return <FaFileArchive className="text-purple-500" />;
  return <FaFileAlt className="text-gray-500" />;
};

export const PRIORITY_ENUM = [
  { id: 1, label: "High" },
  { id: 2, label: "Normal" },
  { id: 3, label: "Low" },
];

export const getFileTypeCode = (type: string): number => {
  if (type.startsWith("image/")) return 1;
  if (
    type === "application/pdf" ||
    type === "application/msword" ||
    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return 2;
  if (type.startsWith("video/")) return 3;
  return 0;
};

export const handleView = (path: string) => {
    if (!path) return;
    window.open(path, "_blank");
  };

export const ORDER_TYPE_ENUM = [
  { id: 1, label: "Sampling" },
  { id: 2, label: "Production" },
  { id: 3, label: "Re-order" },
];

export const getOrderTypeLabelColor = (type: string) => {
  if (type === "Sampling") return "bg-gray-100 text-gray-800 border-gray-200 px-2.5 py-0.5 rounded-full text-xs font-medium border";
  if (type === "Production") return "bg-orange-100 text-orange-800 border-orange-200 px-2.5 py-0.5 rounded-full text-xs font-medium border";
  if (type === "Re-order") return "bg-green-100 text-green-800 border-green-200 px-2.5 py-0.5 rounded-full text-xs font-medium border";
  return "";
};