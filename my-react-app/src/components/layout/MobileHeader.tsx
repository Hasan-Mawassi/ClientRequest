import { Menu } from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <p className="text-md font-semibold text-slate-900">
            Client Requests
          </p>

          <p className="text-xs text-slate-500">Welcome back, {user?.name}</p>
        </div>
      </div>

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
        {user?.name?.charAt(0).toUpperCase()}
      </div>
    </header>
  );
}
