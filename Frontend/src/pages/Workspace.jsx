import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api/axios';
import SideBar from '../components/SideBar';
import MainPage from './MainPage';
import useAuthStore from '../store/authStore';

const defaultUser = {
  name: 'User',
  email: '',
  office: '401',
  theme: 'light',
};

const deskLayouts = {
  401: [
    { id: 1, name: 'Стол 1', left: '14%', top: '6%', width: '18%', height: '16%' },
    { id: 2, name: 'Стол 2', left: '34%', top: '6%', width: '18%', height: '16%' },
    { id: 3, name: 'Стол 3', left: '54%', top: '6%', width: '18%', height: '16%' },
    { id: 4, name: 'Стол 4', left: '74%', top: '6%', width: '18%', height: '16%' },
    { id: 5, name: 'Стол 5', left: '87%', top: '22%', width: '10%', height: '22%' },
    { id: 6, name: 'Стол 6', left: '87%', top: '46%', width: '10%', height: '26%', trackable: false },
    { id: 7, name: 'Стол 7', left: '87%', top: '74%', width: '10%', height: '24%' },
    { id: 8, name: 'Стол 8', left: '3%', top: '50%', width: '10%', height: '24%' },
    { id: 9, name: 'Стол 9', left: '3%', top: '24%', width: '10%', height: '22%' },
  ],
  407: [
    { id: 1, name: 'Стол 1', left: '8%', top: '4%', width: '14%', height: '26%' },
    { id: 2, name: 'Стол 2', left: '27%', top: '4%', width: '24%', height: '16%' },
    { id: 3, name: 'Стол 3', left: '54%', top: '4%', width: '24%', height: '16%' },
    { id: 4, name: 'Стол 4', left: '2%', top: '38%', width: '12%', height: '24%' },
    { id: 5, name: 'Стол 5', left: '2%', top: '64%', width: '12%', height: '24%' },
    { id: 6, name: 'Стол 6', left: '2%', top: '88%', width: '26%', height: '10%' },
    { id: 7, name: 'Стол 7', left: '43%', top: '38%', width: '12%', height: '24%' },
    { id: 8, name: 'Стол 8', left: '56%', top: '46%', width: '10%', height: '16%', trackable: false },
    { id: 9, name: 'Стол 9', left: '43%', top: '64%', width: '24%', height: '16%' },
    { id: 10, name: 'Стол 10', left: '83%', top: '28%', width: '12%', height: '22%' },
    { id: 11, name: 'Стол 11', left: '83%', top: '52%', width: '12%', height: '22%' },
    { id: 12, name: 'Стол 12', left: '83%', top: '76%', width: '12%', height: '22%' },
  ],
};

const formatTime = (seconds = 0) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [hours, minutes, secs]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
};

const PageShell = ({ title, isDark, children }) => (
  <section className="ml-56 min-h-screen px-6 py-6">
    <header className="flex items-center justify-between">
      <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
    </header>
    {children}
  </section>
);

const BookingsPage = ({ history, isDark }) => (
  <PageShell title="Бронирования" isDark={isDark}>
    <div className="mt-6 space-y-3">
      {history.length ? (
        history.map((item) => {
          const startMs = item.start_time ? new Date(item.start_time).getTime() : null;
          const endMs = item.end_time ? new Date(item.end_time).getTime() : null;
          const durationSeconds =
            startMs && endMs && Number.isFinite(startMs) && Number.isFinite(endMs)
              ? Math.max(0, Math.round((endMs - startMs) / 1000))
              : (item.duration_minutes || 0) * 60;

          return (
          <div
            key={item.id}
            className={`rounded-xl border p-4 ${isDark ? 'border-slate-700 bg-slate-950' : 'border-slate-200 bg-white'}`}
          >
            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {(item.user?.name || item.user?.username || '—')} — стол {item.place_number}
            </p>
            <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Кабинет {item.room_name} — {item.user?.email || ''}
            </p>
            <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {item.start_time ? new Date(item.start_time).toLocaleString() : ''} — Время: {formatTime(durationSeconds)}
            </p>
          </div>
          );
        })
      ) : (
        <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>История бронирований пока пустая.</p>
      )}
    </div>
  </PageShell>
);

const EmployeesPage = ({ user, isDark }) => (
  <PageShell title="Сотрудники" isDark={isDark}>
    <div className={`mt-6 rounded-xl border p-4 ${isDark ? 'border-slate-700 bg-slate-950' : 'border-slate-200'}`}>
      <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.name}</p>
      <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{user.email}</p>
      <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Кабинет {user.office}</p>
    </div>
  </PageShell>
);

const SoonPage = ({ isDark }) => (
  <PageShell title="Аналитика" isDark={isDark}>
    <p className={`mt-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Скоро будет доступно…</p>
  </PageShell>
);

const SettingsPage = ({ user, isDark, onLogout, onUpdateUser }) => {
  const [draft, setDraft] = useState(user);
  const [saved, setSaved] = useState(false);

  const handleSave = (event) => {
    event.preventDefault();
    onUpdateUser(draft);
    setSaved(true);
  };

  return (
    <PageShell title="Настройки" isDark={isDark}>
      <form onSubmit={handleSave} className="mt-6 space-y-4">
        <label className={`block text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          Имя
          <input
            value={draft.name}
            onChange={(event) => {
              setSaved(false);
              setDraft({ ...draft, name: event.target.value });
            }}
            className={`mt-2 h-11 w-full rounded-md border px-3 outline-none focus:border-blue-500 ${
              isDark ? 'border-slate-700 bg-slate-950 text-white' : 'border-slate-300 bg-white text-slate-900'
            }`}
          />
        </label>

        <label className={`block text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          Тема
          <select
            value={draft.theme}
            onChange={(event) => {
              setSaved(false);
              setDraft({ ...draft, theme: event.target.value });
            }}
            className={`mt-2 h-11 w-full rounded-md border px-3 outline-none focus:border-blue-500 ${
              isDark ? 'border-slate-700 bg-slate-950 text-white' : 'border-slate-300 bg-white text-slate-900'
            }`}
          >
            <option value="light">Светлая</option>
            <option value="dark">Тёмная</option>
          </select>
        </label>

        <label className={`block text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          Кабинет
          <select
            value={draft.office}
            onChange={(event) => {
              setSaved(false);
              setDraft({ ...draft, office: event.target.value });
            }}
            className={`mt-2 h-11 w-full rounded-md border px-3 outline-none focus:border-blue-500 ${
              isDark ? 'border-slate-700 bg-slate-950 text-white' : 'border-slate-300 bg-white text-slate-900'
            }`}
          >
            <option value="401">401</option>
            <option value="407">407</option>
          </select>
        </label>

        {saved && <p className="text-sm text-emerald-500">Настройки сохранены.</p>}

        <button
          type="submit"
          className="h-11 w-full rounded-md bg-blue-600 font-medium text-white transition hover:bg-blue-700"
        >
          Сохранить настройки
        </button>

        <button
          type="button"
          onClick={onLogout}
          className={`h-11 w-full rounded-md font-medium transition ${
            isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          Выйти из аккаунта
        </button>
      </form>
    </PageShell>
  );
};

const Workspace = () => {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);

  const user = useMemo(() => ({ ...defaultUser, ...(authUser || {}) }), [authUser]);
  const isDark = user.theme === 'dark';

  const [activePage, setActivePage] = useState('main');
  const [selectedDeskId, setSelectedDeskId] = useState(1);
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [placesByNumber, setPlacesByNumber] = useState({});
  const [roomHistory, setRoomHistory] = useState([]);
  const [placeHistory, setPlaceHistory] = useState([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roomId = activeRoom?.id;

  const desks = useMemo(() => {
    const layout = deskLayouts[user.office] || deskLayouts[401];
    return layout.map((desk) => {
      const place = placesByNumber[desk.id];
      const bookedBy = place?.user?.name || place?.user_name || '';
      const bookedEmail = place?.user?.email || '';

      return {
        ...desk,
        placeId: place?.id || null,
        occupiedAt: place?.occupied_at || null,
        status: place?.status || 'available',
        bookedBy,
        bookedEmail,
        history: placeHistory,
      };
    });
  }, [placesByNumber, placeHistory, user.office]);

  const selectedDesk = useMemo(
    () => desks.find((desk) => desk.id === selectedDeskId) || desks[0],
    [desks, selectedDeskId],
  );

  const pickRoomForOffice = (roomsList, office) => {
    const officeText = String(office);
    const exact = roomsList.find((room) => String(room.name) === officeText);
    if (exact) return exact;

    const containsName = roomsList.find((room) => String(room.name).includes(officeText));
    if (containsName) return containsName;

    const containsQr = roomsList.find((room) => String(room.qr_code || '').includes(officeText));
    if (containsQr) return containsQr;

    return null;
  };

  const refreshRooms = async () => {
    const response = await api.get('/rooms');
    const roomsList = response.data || [];
    setRooms(roomsList);
    return roomsList;
  };

  const refreshPlaces = async () => {
    if (!roomId) return;
    const response = await api.get(`/rooms/${roomId}/places`);
    const places = response.data || [];
    const mapping = places.reduce((acc, place) => {
      acc[place.number] = place;
      return acc;
    }, {});
    setPlacesByNumber(mapping);
  };

  const refreshRoomHistory = async () => {
    if (!roomId) return;
    const response = await api.get(`/rooms/${roomId}/history`);
    setRoomHistory(response.data || []);
  };

  const refreshPlaceHistory = async () => {
    if (!selectedDesk?.placeId) {
      setPlaceHistory([]);
      return;
    }
    const response = await api.get(`/places/${selectedDesk.placeId}/history`);
    const history = (response.data || []).map((item) => {
      const startMs = item.start_time ? new Date(item.start_time).getTime() : null;
      const endMs = item.end_time ? new Date(item.end_time).getTime() : null;
      const durationSeconds =
        startMs && endMs && Number.isFinite(startMs) && Number.isFinite(endMs)
          ? Math.max(0, Math.round((endMs - startMs) / 1000))
          : (item.duration_minutes || 0) * 60;

      return {
        id: item.id,
        userName: item.user?.name || item.user?.username || '—',
        duration: durationSeconds,
      };
    });
    setPlaceHistory(history);
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const roomsList = await refreshRooms();
        const room = pickRoomForOffice(roomsList, user.office);
        if (!cancelled) setActiveRoom(room);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Не удалось загрузить кабинеты');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const room = pickRoomForOffice(rooms, user.office);
    setActiveRoom(room);
  }, [rooms, user.office]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!roomId) return;
      setLoading(true);
      setError('');
      try {
        await refreshPlaces();
        await refreshRoomHistory();
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || 'Не удалось загрузить места');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  useEffect(() => {
    setSelectedDeskId((current) => {
      const exists = desks.some((desk) => desk.id === current);
      return exists ? current : desks[0]?.id ?? 1;
    });
  }, [desks]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        await refreshPlaceHistory();
      } catch {
        if (!cancelled) setPlaceHistory([]);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [selectedDesk?.placeId]);

  useEffect(() => {
    const occupiedAt = selectedDesk?.occupiedAt;
    const isBooked = selectedDesk?.status === 'booked';
    const canTrack = selectedDesk?.trackable !== false;

    if (!occupiedAt || !isBooked || !canTrack) {
      setElapsedSeconds(0);
      return undefined;
    }

    const startMs = new Date(occupiedAt).getTime();
    const update = () => {
      const diff = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
      setElapsedSeconds(diff);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [selectedDesk?.occupiedAt, selectedDesk?.status, selectedDesk?.trackable]);

  const handleSelectDesk = (deskId) => {
    setSelectedDeskId(deskId);
  };

  const handleBookDesk = async () => {
    if (!selectedDesk?.placeId) {
      setError('Место не найдено на сервере. Проверь, что в этом кабинете созданы места с номерами как на карте.');
      return;
    }
    if (selectedDesk.status === 'booked' || selectedDesk.trackable === false) return;

    setLoading(true);
    setError('');
    try {
      await api.post(`/places/${selectedDesk.placeId}/occupy`);
      await refreshPlaces();
      await refreshRoomHistory();
      await refreshPlaceHistory();
    } catch (err) {
      setError(err?.response?.data?.message || 'Не удалось занять место');
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseDesk = async () => {
    if (!selectedDesk?.placeId) {
      setError('Место не найдено на сервере. Проверь, что в этом кабинете созданы места с номерами как на карте.');
      return;
    }
    if (selectedDesk.status !== 'booked' || selectedDesk.trackable === false) return;

    setLoading(true);
    setError('');
    try {
      await api.post(`/places/${selectedDesk.placeId}/leave`);
      await refreshPlaces();
      await refreshRoomHistory();
      await refreshPlaceHistory();
      setElapsedSeconds(0);
    } catch (err) {
      setError(err?.response?.data?.message || 'Не удалось освободить место');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOffice = (office) => {
    updateUser({ ...user, office });
  };

  const handleUpdateUser = (nextUser) => {
    updateUser({ ...user, ...nextUser });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <main className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <SideBar
        activePage={activePage}
        user={user}
        isDark={isDark}
        onNavigate={setActivePage}
      />

      {error && (
        <div className="ml-56 px-6 pt-4">
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        </div>
      )}

      {!loading && !error && !roomId && (
        <div className="ml-56 px-6 pt-4">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            Кабинет <span className="font-semibold">{user.office}</span> не найден на сервере. Создай комнаты в админке
            (например, названия <span className="font-semibold">401</span> и <span className="font-semibold">407</span>)
            и места с номерами <span className="font-semibold">1..9</span> для 401 и <span className="font-semibold">1..12</span> для 407.
          </div>
        </div>
      )}

      {activePage === 'main' && (
        <MainPage
          user={user}
          desks={desks}
          selectedDesk={selectedDesk}
          selectedDeskId={selectedDeskId}
          elapsedSeconds={elapsedSeconds}
          isDark={isDark}
          onSelectDesk={handleSelectDesk}
          onBookDesk={handleBookDesk}
          onReleaseDesk={handleReleaseDesk}
          onUpdateOffice={handleUpdateOffice}
        />
      )}

      {activePage === 'bookings' && <BookingsPage history={roomHistory} isDark={isDark} />}
      {activePage === 'employees' && <EmployeesPage user={user} isDark={isDark} />}
      {activePage === 'analytics' && <SoonPage isDark={isDark} />}
      {activePage === 'settings' && (
        <SettingsPage
          user={user}
          isDark={isDark}
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {loading && (
        <div className="pointer-events-none fixed inset-0 flex items-start justify-end p-4">
          <div className="rounded-xl bg-slate-900/80 px-3 py-2 text-xs font-semibold text-white backdrop-blur">
            Loading…
          </div>
        </div>
      )}
    </main>
  );
};

export default Workspace;
