
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginWithData } = useAuth();

  async function submit(e) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const data = await login(phone, password);
      const token = data.token || data.accessToken || null;
      const user = data.user || null;
      if (token) {
        loginWithData({ token, user });
        Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ',
          confirmButtonColor: '#facc15',
          customClass: { popup: 'rounded-xl' }
        }).then(() => navigate('/'));
      } else {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'เข้าสู่ระบบสำเร็จแต่ไม่ได้รับ token',
          confirmButtonColor: '#facc15',
          customClass: { popup: 'rounded-xl' }
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: err.response?.data?.message || err.message || 'เข้าสู่ระบบล้มเหลว',
        confirmButtonColor: '#facc15',
        customClass: { popup: 'rounded-xl' }
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffbe6] to-white flex items-center justify-center px-2">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-yellow-100">
        <h1 className="text-3xl font-bold mb-6 text-yellow-700 text-center">เข้าสู่ระบบ</h1>
        {msg && <div className="rounded mb-4 px-3 py-2 bg-red-100 text-red-700 border border-red-200 text-center">{msg}</div>}
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input placeholder="เบอร์โทรศัพท์" value={phone} onChange={e=>setPhone(e.target.value)} className="input input-bordered border-yellow-200 focus:border-yellow-400 placeholder-yellow-300 text-yellow-800 bg-white w-full h-12 rounded-lg" required autoFocus />
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} placeholder="รหัสผ่าน" value={password} onChange={e=>setPassword(e.target.value)} className="input input-bordered border-yellow-200 focus:border-yellow-400 placeholder-yellow-300 text-yellow-800 bg-white w-full h-12 rounded-lg pr-12" required />
            <button type="button" tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400 hover:text-yellow-700" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}>
              {showPassword ? (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.06 10.06 0 0 1 12 20C7 20 2.73 16.11 1 12c.73-1.67 2.07-3.76 4.06-5.94M9.53 9.53A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3 0 .47-.11.91-.29 1.29"/><path d="M1 1l22 22"/></svg>
              ) : (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="7"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
          <button className="btn btn-primary text-lg h-12 rounded-lg mt-2 shadow-none" disabled={loading}>{loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}</button>
        </form>
        <div className="mt-6 text-center text-yellow-600">
          ยังไม่มีบัญชี?{' '}
          <Link to="/register" className="underline text-yellow-700 hover:text-yellow-900">สมัครสมาชิก</Link>
        </div>
      </div>
    </div>
  );
}
