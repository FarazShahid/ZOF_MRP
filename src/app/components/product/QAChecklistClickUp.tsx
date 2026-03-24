import { QAChecklistClickUpProps, QAItem } from "@/src/types/product";
import React, { useEffect, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { ClipboardList } from "lucide-react";

const uid = () => crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);

// Match order/product form field style (e.g., Target Delivery Date)
const qaInputStyle =
  "w-full bg-slate-800 text-white text-sm px-4 py-3 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500";

const QAChecklistClickUp: React.FC<QAChecklistClickUpProps> = ({
  initialItems = [],
  onChange,
  onCreate,
  heading = "Checklists",
  createLabel = "Create checklist",
}) => {
  const [items, setItems] = useState<QAItem[]>(initialItems);
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    onChange?.(items);
  }, [items, onChange]);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const completed = items.filter((i) => i.done).length;
  const total = items.length;

  const addItem = () => {
    const t = draft.trim();
    if (!t) return;
    setItems((prev) => [...prev, { id: uid(), title: t, done: true }]);
    setDraft("");
    setIsAdding(false);
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-slate-600 rounded-xl flex items-center justify-center shrink-0">
          <ClipboardList className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-semibold text-white">{heading}</h2>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              {completed}/{total || 0}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Mark quality assurance items for this product
          </p>
        </div>
      </div>

      {/* Items: 2 per row */}
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 rounded-xl border border-slate-700 dark:bg-slate-800/50 bg-slate-800/30 px-3 py-2 min-h-[2.5rem]"
          >
            <span
              className="flex-1 min-w-0 truncate text-sm text-white"
              title={item.title}
            >
              {item.title}
            </span>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="shrink-0 p-1.5 rounded-lg text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Remove item"
              aria-label={`Remove ${item.title}`}
            >
              <MdDelete className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add: one button, then inline input when adding */}
      <div className="flex items-center gap-2 flex-wrap">
        {!isAdding ? (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors border border-green-500/30"
            title="Add checklist item"
          >
            <FaCirclePlus className="w-4 h-4 shrink-0" />
            Add
          </button>
        ) : (
          <>
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addItem();
                if (e.key === "Escape") {
                  setDraft("");
                  setIsAdding(false);
                }
              }}
              placeholder="Checklist item (press Enter to add)"
              className={`flex-1 min-w-[200px] ${qaInputStyle}`}
            />
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors border border-green-500/30"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setDraft("");
                setIsAdding(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/30"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QAChecklistClickUp;
