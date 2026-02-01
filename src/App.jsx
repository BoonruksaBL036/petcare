import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Bookings from './pages/Bookings';
import MyPets from './pages/MyPets';
import UserProfile from './pages/UserProfile';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';

export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen">
          <Navbar />
          <main className="p-4 bg-gradient-to-b from-blue-50 to-white min-h-[calc(100vh-64px)]">
            <Routes>
              <Route path="/" element={<Services/>} />
              <Route path="/services/:id" element={<ServiceDetail/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/register" element={<Register/>} />
              <Route path="/bookings" element={<ProtectedRoute><Bookings/></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
              <Route path="/mypets" element={<ProtectedRoute><MyPets/></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><UserProfile/></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
