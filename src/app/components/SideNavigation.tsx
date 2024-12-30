import Tooltip from "./Tooltip";

const clientslist = [
  { name: "John Doe", id: "1" },
  { name: "Jane Smith", id: "2" },
  { name: "Michael Johnson", id: "3" },
  { name: "Emily Davis", id: "4" },
  { name: "James Brown", id: "5" },
  { name: "Sophia Wilson", id: "6" },
  { name: "David Clark", id: "7" },
  { name: "Olivia Lewis", id: "8" },
  { name: "Daniel Walker", id: "9" },
  { name: "Mia Martinez", id: "10" },
];

function SideNavigation() {
  const selectedClient = "6";
  return (
    <div id="default-sidebar" className="j-side-nav overflow-y-auto py-3">
      <label htmlFor="clients-list" className="text-xl font-bold px-5 my-3">
        Clients
      </label>
      <ul
        id="clients-list"
        className="custom-scrollbar flex w-full flex-col gap-2.5 text-sm h-full px-3 max-h-[calc(100vh-145px)]"
      >
        {clientslist?.map((client, index) => (
        //   <Tooltip
        //     data-tooltip-target={client.id}
        //     tooltipContent={client.name}
        //     key={client.id}
        //   >
            <li
            key={client.id}
              data-tooltip-target={client.id}
              className={`min-h-[24.8px] px-1.5 py-0.5 border-b border-b-[#e0e0e0] hover:opacity-90 cursor-pointer hover:bg-[#cedfee] hover:rounded-xl truncate ${
                selectedClient === client.id ? "bg-[#c2e7ff] rounded-xl" : ""
              }`}
            >
              {client.name}
            </li>
        //   </Tooltip>
        ))}
      </ul>
    </div>
  );
}

export default SideNavigation;
