import {
  FiBarChart2,
  FiCalendar,
  FiGrid,
  FiSettings,
  FiUsers,
} from 'react-icons/fi';
import { FaRegBuilding } from 'react-icons/fa';

const navItems = [
  { id: 'main', label: 'Главная', icon: FiGrid },
  { id: 'bookings', label: 'Бронирования', icon: FiCalendar },
  { id: 'employees', label: 'Сотрудники', icon: FiUsers },
  { id: 'analytics', label: 'Аналитика', icon: FiBarChart2 },
  { id: 'settings', label: 'Настройки', icon: FiSettings },
];

const SideBar = ({ activePage, user, isDark, onNavigate }) => (
  <aside className={`fixed left-0 top-0 z-20 flex h-screen w-55 flex-col overflow-y-auto border-r p-2 ${
    isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
  }`}>
    <div className="mb-3 flex items-center gap-3 p-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
        <FaRegBuilding />
      </span>
      <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>WorkSpace</h1>
    </div>

    {navItems.map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        type="button"
        onClick={() => onNavigate(id)}
        className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2 text-base font-semibold transition ${
          activePage === id
            ? 'bg-blue-600 text-white'
            : isDark
              ? 'text-slate-300 hover:bg-slate-800'
              : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        <Icon /> {label}
      </button>
    ))}

    <div className={`mt-auto flex items-center gap-2 rounded-2xl border p-2 ${
      isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white'
    }`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
        {user.name.slice(0, 1).toUpperCase()}
      </div>
      <div className="min-w-0">
        <p className={`truncate text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{user.name}</p>
        <p className={`truncate text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{user.email}</p>
      </div>
    </div>
  </aside>
);

export default SideBar;
