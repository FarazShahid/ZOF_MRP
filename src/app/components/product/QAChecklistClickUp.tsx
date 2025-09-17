import { QAChecklistClickUpProps, QAItem } from "@/src/types/product";
import React, { useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { MdCancel } from "react-icons/md";

const uid = () => crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);

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

  // NEW: keep items in sync whenever initialItems prop changes
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const completed = items.filter((i) => i.done).length;
  const total = items.length;

  const addItem = () => {
    const t = draft.trim();
    if (!t) return;
    setItems((prev) => [...prev, { id: uid(), title: t, done: false }]);
    setDraft("");
    setIsAdding(false);
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));
  const toggleItem = (id: string) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i))
    );

  return (
    <div className="w-[500px]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <h1 className="text-xl font-semibold">{heading}</h1>
        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
          {completed}/{total || 0}
        </span>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
        {/* Subheader */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="text-sm font-medium text-gray-800">
            Checklist <span className="text-gray-500">({total}/1)</span>
          </div>
        </div>

        {/* Items */}
        <div className="divide-y divide-gray-100">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3">
              {/* checkbox circle */}
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className={`shrink-0 size-5 rounded-full border flex items-center justify-center transition ${
                  item.done
                    ? "bg-violet-600 border-violet-600"
                    : "border-gray-300 bg-white"
                }`}
                aria-label={item.done ? "Mark as undone" : "Mark as done"}
              >
                {item.done && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="size-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.28 16.28a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06l2.47 2.47 5.47-5.47a.75.75 0 1 1 1.06 1.06l-6 6Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              {/* title */}
              <span
                className={`flex-1 text-sm ${
                  item.done ? "line-through text-gray-400" : "text-gray-800"
                }`}
              >
                {item.title}
              </span>

              {/* remove */}
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="p-2 rounded-xl border border-transparent text-gray-400 hover:text-red-600 hover:border-red-200"
                title="Remove item"
                aria-label={`Remove ${item.title}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.5 4.478V5.25h2.25a.75.75 0 0 1 0 1.5h-.32l-.846 12.015A2.25 2.25 0 0 1 15.34 21H8.66a2.25 2.25 0 0 1-2.244-2.235L5.57 6.75h-.32a.75.75 0 0 1 0-1.5H7.5v-.772A2.25 2.25 0 0 1 9.75 1.5h4.5A2.25 2.25 0 0 1 16.5 4.478ZM9 9.75a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0v-6A.75.75 0 0 1 9 9.75Zm6 .75a.75.75 0 0 0-1.5 0v6a.75.75 0 0 0 1.5 0v-6Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Add new */}
        <div className="px-4 py-2">
          {!isAdding ? (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
            >
              <span className="text-lg leading-none">+</span>
              <span>New checklist item</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
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
                placeholder="Write item title and press Enter"
                className="flex-1 px-3 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <button
                type="button"
                onClick={addItem}
                className=" text-green-600"
              >
                <IoIosAddCircle size={30} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraft("");
                  setIsAdding(false);
                }}
                className="text-red-600"
              >
                <MdCancel size={30} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QAChecklistClickUp;
