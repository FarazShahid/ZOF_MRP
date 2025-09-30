import useQAchecklistStore from "@/store/useQAchecklistStore";
import { Button } from "@heroui/react";
import React, { FC } from "react";
import { FiDownload, FiLoader } from "react-icons/fi";

interface Props {
  orderId: number;
  selectedItems: number[];
}

const QASheetGenerator: FC<Props> = ({ orderId, selectedItems }) => {
  const { downloadQAChecklistZip, loading: qaLoading } = useQAchecklistStore();

  const handleDownloadQA = async () => {
    await downloadQAChecklistZip(orderId, selectedItems);
  };

  return (
    <Button
      type="button"
      onPress={qaLoading ? undefined : handleDownloadQA}
      isLoading={qaLoading}
      isDisabled={qaLoading}
      spinner={<FiLoader className="animate-spin" />}
      spinnerPlacement="start"
      className={[
        "px-3 py-1 flex items-center gap-2 rounded-lg text-sm text-white",
        "bg-blue-800 dark:bg-blue-600",
        qaLoading ? "opacity-60 cursor-not-allowed" : "",
      ].join(" ")}
      aria-busy={qaLoading}
      title={
        qaLoading ? "Downloading…" : "Download QA Sheets ZIP for selected items"
      }
    >
      {!qaLoading && <FiDownload />}
      {qaLoading ? "Downloading…" : "QA Sheet"}
    </Button>
  );
};

export default QASheetGenerator;
