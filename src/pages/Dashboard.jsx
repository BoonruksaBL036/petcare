import AdminDashboard from './dashboard/AdminDashboard';
import { useAuth } from '../context/AuthContext';

export default function Dashboard(){
  const { user } = useAuth();

  if(!user) return <div className="p-4">Not authenticated</div>;

  if(user.role === 'admin') return <AdminDashboard user={user} />;
}
