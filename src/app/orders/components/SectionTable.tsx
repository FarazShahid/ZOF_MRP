
export const SectionTable: React.FC<{ title: string; rows: Array<[string, string]> }> = ({ title, rows }) => {
  if (!rows.length) return null;
  return (
    <div className="mb-6">
      <div className="font-semibold mb-2 text-lg">{title}</div>
      <div className="h-[calc(100vh-380px)] overflow-auto">
      <table className="w-full border-collapse">
        <tbody>
          {rows.map(([label, value], idx) => (
            <tr key={label} className={idx % 2 === 0 ? "bg-gray-100 text-center" : "text-center"}>
              <td className="px-2 py-1 text-left">{label}</td>
              <td className="px-2 py-1 w-24 text-right">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};
