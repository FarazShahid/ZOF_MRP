import { ReactNode } from "react";

interface WidgetProps {
  total: number;
  title: string;
  icon: ReactNode;
  iconBg: string;
}

const Widget: React.FC<WidgetProps> = ({ total, title, icon, iconBg }) => {
  return (
    <div className="bg-white p-5 flex flex-col gap-2 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="font-semibold capitalize">{title}</span>
        <div
          className="rounded-full text-white p-2"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>
      </div>
      <div className="font-semibold text-4xl text-[#9747FF] font-mono">
        {total || 0}
      </div>
    </div>
  );
};

export default Widget;
