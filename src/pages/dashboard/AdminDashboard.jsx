import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { createService, updateService } from '../../services/service.service';
import { getPets } from '../../services/pet.service';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


const STATUS_OPTIONS = [
  'pending',
  'confirmed',
  'in-progress',
  'completed',
  'cancelled'
];

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-yellow-100 bg-opacity-60">
      <div className="bg-white rounded-xl shadow-xl p-6 min-w-[320px] max-w-[90vw] relative animate-fadeIn border border-yellow-200">
        <button className="absolute top-2 right-2 text-yellow-400 hover:text-yellow-700 text-2xl" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
}

export default function AdminDashboard(){
  async function handleStatusChange(bookingId, newStatus) {
    try {
      await api.put(`/bookings/${bookingId}`, { status: newStatus });
      load();
      Swal.fire('สำเร็จ', 'อัปเดตสถานะเรียบร้อย', 'success');
    } catch (err) {
      Swal.fire('เกิดข้อผิดพลาด', err.response?.data?.message || err.message || 'อัปเดตสถานะไม่สำเร็จ', 'error');
    }
  }
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: '', description: '' });
  const [newServiceFile, setNewServiceFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editService, setEditService] = useState({ name: '', price: '', description: '' });
  const [editServiceFile, setEditServiceFile] = useState(null);
  const [showRole, setShowRole] = useState(false);
  const [roleUserId, setRoleUserId] = useState('');
  const [role, setRole] = useState('customer');
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [bookings, setBookings] = useState([])
  const [allPets, setAllPets] = useState([]);

  async function load() {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('DEBUG (load) token:', token);
      console.log('DEBUG (load) user:', user);
      const [svcRes, bksRes, petsRes] = await Promise.all([
        api.get('/services'),
        api.get('/bookings'),
        getPets()
      ]);
      setServices(svcRes.data || []);
      setBookings(bksRes.data || []);
      setAllPets(petsRes || []);
    } catch (err) {
      console.error('DEBUG (load) error:', err, err.response?.data);
      setMsg(err.response?.data?.message || err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }
  // ลบ useEffect ที่เกี่ยวกับ technician
  // ลบฟังก์ชัน assign technician

  useEffect(()=>{ load(); }, []);

  useEffect(() => {
    if (showRole) {
      setUsersLoading(true);
      api.get('/users')
        .then(res => setUsers(res.data || []))
        .catch(() => setUsers([]))
        .finally(() => setUsersLoading(false));
    }
  }, [showRole]);


  async function handleAdd() {
    try {
      await createService({
        name: newService.name,
        price: newService.price,
        description: newService.description,
        file: newServiceFile
      });
      setShowAdd(false);
      setNewService({ name: '', price: '', description: '' });
      setNewServiceFile(null);
      load();
      Swal.fire('สร้างสำเร็จ!', 'เพิ่มบริการใหม่เรียบร้อย', 'success');
    } catch (err) {
      console.error('DEBUG error:', err, err.response?.data);
      Swal.fire('เกิดข้อผิดพลาด', err.response?.data?.message || err.message || 'เพิ่มบริการไม่สำเร็จ', 'error');
    }
  }

  async function handleEdit() {
    try {
      await updateService(editId, {
        name: editService.name,
        price: editService.price,
        description: editService.description,
        file: editServiceFile
      });
      setEditId(null);
      setEditService({ name: '', price: '', description: '' });
      setEditServiceFile(null);
      load();
      Swal.fire('บันทึกสำเร็จ!', 'แก้ไขบริการเรียบร้อย', 'success');
    } catch (err) {
      Swal.fire('เกิดข้อผิดพลาด', err.response?.data?.message || err.message || 'แก้ไขบริการไม่สำเร็จ', 'error');
    }
  }

  // ฟังก์ชันเปลี่ยน role ถูกลบออก เพราะไม่มีใน service

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffbe6] to-white">
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-3xl font-extrabold mb-6 text-yellow-700 drop-shadow text-center">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <button className="rounded-full px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold shadow transition" onClick={()=>setShowAdd(true)}>+ เพิ่มบริการ</button>
        </div>
        {msg && <div className="alert alert-error mb-4 bg-yellow-100 text-yellow-700 border-yellow-300">{msg}</div>}
        <section className="bg-white rounded-2xl shadow p-6 border border-yellow-100 mb-8">
          <h2 className="text-xl font-bold mb-4 text-yellow-700">บริการทั้งหมด</h2>
          {loading ? <div className="text-yellow-400">กำลังโหลด...</div> : (
            <div className="divide-y divide-yellow-100">
              {services.map(s => (
                <div key={s._id} className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 gap-2">
                  <div>
                    <div className="font-bold text-lg text-yellow-800">{s.name}</div>
                    <div className="text-sm text-yellow-600">฿{s.price}</div>
                    <div className="text-xs text-yellow-500 max-w-xs truncate">{s.description}</div>
                  </div>
                  <button className="btn btn-outline btn-sm border-yellow-400 text-yellow-700 hover:bg-yellow-50 rounded-full" onClick={()=>{setEditId(s._id); setEditService({ name: s.name, price: s.price, description: s.description, imageUrl: s.imageUrl });}}>แก้ไข</button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* รายการจองบริการ */}
        <section className="bg-white rounded-2xl shadow p-6 border border-yellow-100 mb-8">
          <h2 className="text-xl font-bold mb-4 text-yellow-700">รายการจองบริการ</h2>
          {loading ? <div className="text-yellow-400">กำลังโหลด...</div> : (
            bookings.length === 0 ? (
              <div className="alert bg-yellow-100 text-yellow-700">ไม่มีรายการจอง</div>
            ) : (
              <div className="grid gap-4">
                {bookings.map(b => (
                  <div key={b._id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-yellow-50 rounded-xl border border-yellow-200 shadow">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-yellow-800 text-lg mb-1">บริการ: {b.serviceId?.name || '-'}</div>
                      <div className="text-yellow-700 mb-1">สัตว์เลี้ยง: {
                        b.petId?.petName
                        || (allPets.find(p => String(p._id) === String(b.petId?._id || b.petId))?.petName || '-')
                      }
                        {(() => {
                          const pet = allPets.find(p => String(p._id) === String(b.petId?._id || b.petId));
                          return pet && pet.petType ? ` (${pet.petType})` : '';
                        })()}
                      </div>
                      <div className="text-yellow-600 mb-1">วัน-เวลา: {b.bookingDate ? `${b.bookingDate} ${b.bookingTime}` : '-'}</div>
                      <div className="text-yellow-500 mb-1 flex items-center gap-2">สถานะ:
                        <select
                          className="select select-bordered select-sm border-yellow-300 text-yellow-800 bg-white"
                          value={b.status}
                          onChange={e => handleStatusChange(b._id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div className="text-yellow-500 mb-1">ผู้จอง: <span className="font-semibold">{b.customerName || '-'}</span></div>
                      <div className="text-yellow-500 mb-1">เบอร์โทร: <span className="font-semibold">{b.phone || '-'}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </section>
        <Modal open={showAdd} onClose={()=>setShowAdd(false)}>
          <div className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-lg border border-yellow-200 mx-auto overflow-hidden animate-fadeIn">
            <div className="flex flex-col items-center justify-center bg-white py-6 px-4 border-b border-yellow-100">
              <h2 className="text-2xl font-extrabold text-yellow-700 mb-1">เพิ่มบริการใหม่</h2>
              <p className="text-yellow-700 text-sm mb-0">กรอกข้อมูลบริการที่ต้องการเพิ่ม</p>
            </div>
            <form className="flex flex-col gap-4 p-8" onSubmit={e => { e.preventDefault(); handleAdd(); }}>
              <label className="font-semibold text-yellow-700">ชื่อบริการ
                <input className="input input-bordered border-yellow-300 focus:border-yellow-400 placeholder-yellow-200 text-yellow-800 bg-white w-full h-12 rounded-lg mt-1" placeholder="เช่น อาบน้ำ ตัดขน" value={newService.name} onChange={e=>setNewService(s=>({...s, name: e.target.value}))} required />
              </label>
              <label className="font-semibold text-yellow-700">ราคา (บาท)
                <input className="input input-bordered border-yellow-300 focus:border-yellow-400 placeholder-yellow-200 text-yellow-800 bg-white w-full h-12 rounded-lg mt-1" placeholder="เช่น 300" type="number" value={newService.price} onChange={e=>setNewService(s=>({...s, price: e.target.value}))} required min="0" step="0.01" />
              </label>
              <label className="font-semibold text-yellow-700">รายละเอียด
                <textarea className="input input-bordered border-yellow-300 focus:border-yellow-400 placeholder-yellow-200 text-yellow-800 bg-white w-full rounded-lg min-h-20 mt-1" placeholder="รายละเอียดบริการเพิ่มเติม (ถ้ามี)" value={newService.description} onChange={e=>setNewService(s=>({...s, description: e.target.value}))} />
              </label>
              <label className="font-semibold text-yellow-700">อัปโหลดรูปภาพ
                <input type="file" accept="image/*" className="file-input file-input-bordered border-yellow-300 text-yellow-800 bg-white w-full rounded-lg mt-1" onChange={e=>setNewServiceFile(e.target.files[0])} />
              </label>
              <div className="flex gap-2 mt-4">
                <button className="btn btn-primary bg-yellow-400 hover:bg-yellow-500 text-white text-lg h-12 rounded-full flex-1 shadow-none" type="submit">บันทึก</button>
                <button type="button" className="btn btn-outline border-yellow-300 text-yellow-700 h-12 rounded-full flex-1" onClick={()=>setShowAdd(false)}>ยกเลิก</button>
              </div>
            </form>
          </div>
        </Modal>
        <Modal open={!!editId} onClose={()=>setEditId(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-yellow-100 mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-yellow-700 text-center">แก้ไขบริการ</h2>
            <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); handleEdit(); }}>
              <input className="input input-bordered border-yellow-200 focus:border-yellow-400 placeholder-yellow-300 text-yellow-800 bg-white w-full h-12 rounded-lg" placeholder="ชื่อบริการ" value={editService.name} onChange={e=>setEditService(s=>({...s, name: e.target.value}))} required />
              <input className="input input-bordered border-yellow-200 focus:border-yellow-400 placeholder-yellow-300 text-yellow-800 bg-white w-full h-12 rounded-lg" placeholder="ราคา" type="number" value={editService.price} onChange={e=>setEditService(s=>({...s, price: e.target.value}))} required min="0" step="0.01" />
              <textarea className="input input-bordered border-yellow-200 focus:border-yellow-400 placeholder-yellow-300 text-yellow-800 bg-white w-full rounded-lg min-h-20" placeholder="รายละเอียด" value={editService.description} onChange={e=>setEditService(s=>({...s, description: e.target.value}))} />
              <label className="font-semibold text-yellow-700">อัปโหลดรูปภาพใหม่ (ถ้าต้องการเปลี่ยน)
                <input type="file" accept="image/*" className="file-input file-input-bordered border-yellow-300 text-yellow-800 bg-white w-full rounded-lg mt-1" onChange={e=>setEditServiceFile(e.target.files[0])} />
              </label>
              <button className="btn btn-primary bg-yellow-400 hover:bg-yellow-500 text-white text-lg h-12 rounded-lg mt-2 shadow-none" type="submit">บันทึก</button>
            </form>
          </div>
        </Modal>

      </div>
    </div>
  );
}
