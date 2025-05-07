import { FaFilePdf, FaFileWord, FaFileImage, FaFileArchive, FaFileAlt, FaFileExcel, FaFilePowerpoint } from "react-icons/fa";

export const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <FaFileImage className="text-blue-400" />;
    if (type === "application/pdf") return <FaFilePdf className="text-red-500" />;
    if (type.includes("word")) return <FaFileWord className="text-blue-600" />;
    if (type.includes("excel")) return <FaFileExcel className="text-green-600" />;
    if (type.includes("presentation")) return <FaFilePowerpoint className="text-orange-500" />;
    if (type.includes("zip")) return <FaFileArchive className="text-purple-500" />;
    return <FaFileAlt className="text-gray-500" />;
  };
