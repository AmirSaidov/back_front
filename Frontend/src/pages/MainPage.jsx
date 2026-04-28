import {
  FiChevronDown,
  FiClock,
  FiTrash2,
  FiX,
} from 'react-icons/fi';
import { FaRegCalendarCheck } from 'react-icons/fa';

import Plan from '../components/Plan';

const formatTime = (seconds = 0) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [hours, minutes, secs]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
};

const MainPage = ({
  user,
  desks,
  selectedDesk,
  selectedDeskId,
  elapsedSeconds,
  isDark,
  onSelectDesk,
  onBookDesk,
  onReleaseDesk,
  onUpdateOffice,
}) => {
  const isBooked = selectedDesk?.status === 'booked';
  const canTrack = selectedDesk?.trackable !== false;

  return (
    <section className="ml-56 min-h-screen px-2 py-2">
      <header className="flex items-center justify-between px-2">
        <label className={`flex items-center gap-2 text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Кабинет:
          <select
            value={user.office}
            onChange={(event) => onUpdateOffice(event.target.value)}
            className={`rounded-xl border px-3 py-2 text-xl outline-none focus:border-blue-500 ${
              isDark ? 'border-slate-700 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-900'
            }`}
          >
            <option value="401">401</option>
            <option value="407">407</option>
          </select>
          <FiChevronDown className={isDark ? 'text-slate-400' : 'text-slate-500'} />
        </label>

        <div />
      </header>

      <div className="mt-2 grid min-h-[calc(100vh-72px)] grid-cols-[1fr_300px] gap-2">
        <Plan
          desks={desks}
          selectedDeskId={selectedDeskId}
          isDark={isDark}
          onSelectDesk={onSelectDesk}
        />

        <aside className={`rounded-2xl border p-2.5 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Параметры места</h3>
            <FiX className={isDark ? 'text-slate-500' : 'text-slate-400'} />
          </div>
          <div className={`mb-3 h-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />

          <div className="mb-3">
            <div className="mb-1 flex items-center gap-2">
              <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedDesk.name}</p>
              {canTrack ? (
                <span
                  className={`rounded-full px-2 py-1 text-sm font-semibold ${
                    isBooked
                      ? 'bg-red-100 text-red-500'
                      : 'bg-emerald-100 text-emerald-600'
                  }`}
                >
                  {isBooked ? 'Забронирован' : 'Свободен'}
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-2 py-1 text-sm font-semibold text-slate-500">
                  Без отслеживания
                </span>
              )}
            </div>
          </div>

          <div className={`mb-3 h-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Пользователь</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              {(selectedDesk.bookedBy || user.name).slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {selectedDesk.bookedBy || user.name}
              </p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {selectedDesk.bookedEmail || user.email}
              </p>
            </div>
          </div>

          <div className={`my-3 h-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Текущее время</p>
          <p className={`mt-1 flex items-center gap-2 text-base font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            <FiClock /> {canTrack && isBooked ? formatTime(elapsedSeconds) : '00:00:00'}
          </p>

          <div className={`my-3 h-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
          <button
            type="button"
            onClick={onBookDesk}
            disabled={isBooked || !canTrack}
            className="mb-2 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            <FaRegCalendarCheck /> Забронировать
          </button>
          <button
            type="button"
            onClick={onReleaseDesk}
            disabled={!isBooked || !canTrack}
            className={`flex h-10 w-full items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
              isDark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <FiTrash2 /> Освободить стол
          </button>

          <div className={`my-3 h-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
          <p className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>История времени</p>
          <div className="mt-2 space-y-2">
            {!canTrack ? (
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Для этого стола учет времени не ведется.</p>
            ) : selectedDesk.history?.length ? (
              selectedDesk.history.map((item) => (
                <div key={item.id} className={`rounded-lg border p-2 text-sm ${isDark ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-600'}`}>
                  <p>{item.userName}</p>
                  <p>{formatTime(item.duration)}</p>
                </div>
              ))
            ) : (
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Пока нет завершенных сессий.</p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default MainPage;
