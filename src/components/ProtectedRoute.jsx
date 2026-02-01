import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="alert bg-blue-100 text-blue-700">Please login first</div>
      </div>
    );
  }
  if (role && user?.role !== role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="alert bg-blue-100 text-blue-700">Unauthorized</div>
      </div>
    );
  }
  return children;
}
