import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserById, updateUser } from '../services/user.service';

export default function UserProfile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getUserById(user.id || user._id, localStorage.getItem('token'))
      .then(data => setForm({ name: data.name || '', email: data.email || '', phone: data.phone || '' }))
      .catch(err => setMsg(err.message || 'โหลดข้อมูลไม่สำเร็จ'))
      .finally(() => setLoading(false));
  }, [user]);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    updateUser(user.id || user._id, form, localStorage.getItem('token'))
      .then(data => {
        setMsg('บันทึกข้อมูลสำเร็จ');
        setUser(data); // update context
        setEditMode(false);
      })
      .catch(err => setMsg(err.response?.data?.message || err.message || 'บันทึกข้อมูลไม่สำเร็จ'))
      .finally(() => setLoading(false));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffbe6] to-white flex items-center justify-center py-8">
      <div className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-lg border border-yellow-100 overflow-hidden">
        <div className="flex flex-col items-center justify-center bg-gradient-to-r from-yellow-100 to-yellow-200 py-8 px-4 border-b border-yellow-100">
          <div className="w-24 h-24 rounded-full bg-white border-4 border-yellow-300 flex items-center justify-center mb-3 shadow">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#eab308" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 0115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75V19.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold mb-1 text-yellow-700 text-center">โปรไฟล์ผู้ใช้</h1>
          {/* <div className="text-yellow-600 text-sm mb-2">{form.email}</div> */}
        </div>
        <div className="p-8">
          {msg && <div className="alert bg-yellow-100 text-yellow-700 mb-4">{msg}</div>}
          {loading ? (
            <div className="text-yellow-400">กำลังโหลด...</div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <label className="font-semibold text-yellow-700">ชื่อ
                <input className="input input-bordered border-yellow-300 focus:border-yellow-400 text-yellow-800 bg-white w-full rounded-lg mt-1" name="name" value={form.name} onChange={handleChange} disabled={!editMode} required />
              </label>
              {/* <label className="font-semibold text-yellow-700">อีเมล
                <input className="input input-bordered border-yellow-300 focus:border-yellow-400 text-yellow-800 bg-white w-full rounded-lg mt-1" name="email" value={form.email} onChange={handleChange} disabled={!editMode} required type="email" />
              </label> */}
              <label className="font-semibold text-yellow-700">เบอร์โทร
                <input className="input input-bordered border-yellow-300 focus:border-yellow-400 text-yellow-800 bg-white w-full rounded-lg mt-1" name="phone" value={form.phone} onChange={handleChange} disabled={!editMode} />
              </label>
              {editMode ? (
                <div className="flex gap-2">
                  <button className="btn btn-primary bg-yellow-400 hover:bg-yellow-500 text-white rounded-full flex-1" type="submit">บันทึก</button>
                  <button className="btn btn-outline border-yellow-300 text-yellow-700 rounded-full flex-1" type="button" onClick={() => setEditMode(false)}>ยกเลิก</button>
                </div>
              ) : (
                <button className="btn btn-outline border-yellow-400 text-yellow-700 hover:bg-yellow-400 hover:text-white rounded-full w-full" type="button" onClick={() => setEditMode(true)}>แก้ไขโปรไฟล์</button>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
