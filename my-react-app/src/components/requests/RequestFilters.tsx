import type { RequestStatus } from "../../types/request";

interface RequestFiltersProps {
  value?: RequestStatus;
  onChange: (status?: RequestStatus) => void;
}

const filters: {
  label: string;
  value?: RequestStatus;
}[] = [
  { label: "All" },
  { label: "New", value: "NEW" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Done", value: "DONE" },
];

export default function RequestFilters({
  value,
  onChange,
}: RequestFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const active = value === filter.value;

        return (
          <button
            key={filter.label}
            type="button"
            onClick={() => onChange(filter.value)}
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
              active
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
