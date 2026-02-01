
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function onLogout() {
    logout();
    navigate('/');
    setMenuOpen(false);
  }

  return (
    <nav className="bg-[#fffbe6] shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-2 px-4">
        <Link to="/" className="font-bold text-2xl text-yellow-700 tracking-tight">Pet Care</Link>
        {/* Hamburger for mobile */}
        <button
          className="sm:hidden flex items-center px-2 py-1 text-yellow-700 hover:text-yellow-900 focus:outline-none"
          onClick={() => setMenuOpen(m => !m)}
          aria-label="Toggle menu"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Desktop menu */}
        <div className="hidden sm:flex items-center gap-2">
          <Link to="/" className="btn btn-ghost text-yellow-700 hover:bg-yellow-100 rounded-full px-4">บริการสัตว์เลี้ยง</Link>
          {user ? (
            <>
              <Link to="/bookings" className="btn btn-ghost text-yellow-700 hover:bg-yellow-100 rounded-full px-4">การจองของฉัน</Link>
              <Link to="/mypets" className="btn btn-ghost text-yellow-700 hover:bg-yellow-100 rounded-full px-4">สัตว์เลี้ยงของฉัน</Link>
              {user.role === 'admin' && (
                <Link to="/dashboard" className="btn btn-ghost text-yellow-700 hover:bg-yellow-100 rounded-full px-4">Dashboard</Link>
              )}
              <Link to="/profile" className="flex items-center gap-1 text-yellow-700 font-medium mx-2 hover:underline">
                <span className="hidden sm:inline">{user.name}</span>
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#eab308" className="w-7 h-7 bg-white rounded-full border border-yellow-200 p-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 0115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75V19.5z" />
                  </svg>
                </span>
              </Link>
              <button className="btn btn-outline btn-sm border-yellow-400 text-yellow-700 hover:bg-yellow-100 rounded-full" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary rounded-full px-6">เข้าสู่ระบบ</Link>
              <Link to="/register" className="btn bg-white border-yellow-200 text-yellow-700 hover:bg-yellow-50 rounded-full px-6">สมัครสมาชิก</Link>
            </>
          )}
        </div>
        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#fffbe6] shadow-md border-t border-yellow-100 flex flex-col items-stretch sm:hidden animate-fadeIn z-50">
            <Link to="/" className="btn btn-ghost text-yellow-700 hover:bg-yellow-100 rounded-none py-3" onClick={()=>setMenuOpen(false)}>บริการสัตว์เลี้ยง</Link>
            {user ? (
              <>
                <Link to="/bookings" className="btn btn-ghost text-yellow-700 hover:bg-yellow-100 rounded-none py-3" onClick={()=>setMenuOpen(false)}>การจองของฉัน</Link>
                <Link to="/mypets" className="btn btn-ghost text-yellow-700 hover:bg-yellow-100 rounded-none py-3" onClick={()=>setMenuOpen(false)}>สัตว์เลี้ยงของฉัน</Link>
                {user.role === 'admin' && (
                  <Link to="/dashboard" className="btn btn-ghost text-yellow-700 hover:bg-yellow-100 rounded-none py-3" onClick={()=>setMenuOpen(false)}>Dashboard</Link>
                )}
                <Link to="/profile" className="flex items-center gap-1 text-yellow-700 font-medium px-4 py-3 hover:underline" onClick={()=>setMenuOpen(false)}>
                  <span>{user.name}</span>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#eab308" className="w-7 h-7 bg-white rounded-full border border-yellow-200 p-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 0115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75V19.5z" />
                    </svg>
                  </span>
                </Link>
                <button className="btn btn-outline border-yellow-400 text-yellow-700 hover:bg-yellow-100 rounded-none py-3" onClick={onLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary rounded-none py-3" onClick={()=>setMenuOpen(false)}>เข้าสู่ระบบ</Link>
                <Link to="/register" className="btn bg-white border-yellow-200 text-yellow-700 hover:bg-yellow-50 rounded-none py-3" onClick={()=>setMenuOpen(false)}>สมัครสมาชิก</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
