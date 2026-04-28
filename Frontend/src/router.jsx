import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Workspace from './pages/Workspace';
import useAuthStore from './store/authStore';

const RootRedirect = () => {
  const isAuth = useAuthStore((state) => state.isAuth);

  return <Navigate to={isAuth ? '/workspace' : '/login'} replace />;
};

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/workspace"
        element={
          <ProtectedRoute>
            <Workspace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
