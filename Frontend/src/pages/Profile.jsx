import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuthStore from '../store/authStore';

const Profile = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    updateUser({ name, email });
    setMessage('Profile updated');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <section className="w-full max-w-sm rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>

        {user ? (
          <>
            <div className="mt-6 space-y-2 text-slate-700">
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Name
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-slate-900 outline-none focus:border-blue-500"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-slate-900 outline-none focus:border-blue-500"
                />
              </label>

              {message && <p className="text-sm text-green-600">{message}</p>}

              <button
                type="submit"
                className="h-11 w-full rounded-md bg-blue-600 font-medium text-white transition hover:bg-blue-700"
              >
                Save
              </button>
            </form>
          </>
        ) : (
          <p className="mt-6 text-slate-700">No user</p>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 h-11 w-full rounded-md bg-slate-900 font-medium text-white transition hover:bg-slate-800"
        >
          Logout
        </button>
      </section>
    </main>
  );
};

export default Profile;
