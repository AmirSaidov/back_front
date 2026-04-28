import { create } from 'zustand';

const getStoredUser = () => {
  const user = localStorage.getItem('user');

  return user ? JSON.parse(user) : null;
};

const token = localStorage.getItem('token');
const user = getStoredUser();

const useAuthStore = create((set) => ({
  token,
  isAuth: Boolean(token),
  user,

  login: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    set({
      token,
      user,
      isAuth: true,
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    set({
      token: null,
      user: null,
      isAuth: false,
    });
  },

  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
}));

export default useAuthStore;
