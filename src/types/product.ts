export type QAItem = {
id: string;
title: string;
done?: boolean;
};

export type QAChecklistClickUpProps = {
initialItems?: QAItem[];
onChange?: (items: QAItem[]) => void;
onCreate?: (items: QAItem[]) => void;
heading?: string;
createLabel?: string;
};

export type ProductStatus = "Approved" | "Rejected" | "Sample";