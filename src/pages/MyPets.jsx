import { useEffect, useState } from 'react';
import { getPetsByUser, createPet, updatePet, deletePet } from '../services/pet.service';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

export default function MyPets() {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ petName: '', petType: '', breed: '', age: '', note: '' });
  const [editId, setEditId] = useState(null);

  function loadPets() {
    if (!user?.id && !user?._id) return;
    setLoading(true);
    getPetsByUser(user.id || user._id)
      .then(data => setPets(data || []))
      .catch(() => Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลสัตว์เลี้ยงได้', 'error'))
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadPets(); }, [user]);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.petName || !form.breed) {
      Swal.fire('กรอกข้อมูลไม่ครบ', 'กรุณากรอกชื่อและสายพันธุ์', 'warning');
      return;
    }
    setLoading(true);
    const action = editId ? updatePet(editId, form) : createPet({ ...form, owner: user.id || user._id });
    action
      .then(() => {
        Swal.fire('สำเร็จ', editId ? 'แก้ไขข้อมูลแล้ว' : 'เพิ่มสัตว์เลี้ยงแล้ว', 'success');
        setForm({ petName: '', petType: '', breed: '', age: '', note: '' });
        setEditId(null);
        loadPets();
      })
      .catch(() => Swal.fire('เกิดข้อผิดพลาด', 'บันทึกข้อมูลไม่สำเร็จ', 'error'))
      .finally(() => setLoading(false));
  }

  function handleEdit(pet) {
    setForm({
      petName: pet.petName || '',
      petType: pet.petType || '',
      breed: pet.breed || '',
      age: pet.age || '',
      note: pet.note || ''
    });
    setEditId(pet._id);
  }

  function handleDelete(id) {
    Swal.fire({
      title: 'ลบสัตว์เลี้ยง?',
      text: 'คุณแน่ใจหรือไม่ว่าต้องการลบ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    }).then(result => {
      if (result.isConfirmed) {
        setLoading(true);
        deletePet(id)
          .then(() => {
            Swal.fire('ลบแล้ว', '', 'success');
            loadPets();
          })
          .catch(() => Swal.fire('เกิดข้อผิดพลาด', 'ลบไม่สำเร็จ', 'error'))
          .finally(() => setLoading(false));
      }
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffbe6] to-white p-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-yellow-700 drop-shadow">สัตว์เลี้ยงของฉัน</h1>
        <form className="bg-white rounded-xl shadow p-4 mb-6 grid gap-3" onSubmit={handleSubmit}>
          <input className="input input-bordered" name="petName" placeholder="ชื่อสัตว์เลี้ยง" value={form.petName} onChange={handleChange} />
          <input className="input input-bordered" name="petType" placeholder="ชนิด (เช่น สุนัข, แมว)" value={form.petType} onChange={handleChange} />
          <input className="input input-bordered" name="breed" placeholder="สายพันธุ์" value={form.breed} onChange={handleChange} />
          <input className="input input-bordered" name="age" placeholder="อายุ (ปี)" value={form.age} onChange={handleChange} />
          <input className="input input-bordered" name="note" placeholder="หมายเหตุ" value={form.note} onChange={handleChange} />
          <div className="flex gap-2">
            <button className="btn btn-primary bg-yellow-400 text-white border-yellow-300 hover:bg-yellow-500" type="submit" disabled={loading}>
              {editId ? 'บันทึกการแก้ไข' : 'เพิ่มสัตว์เลี้ยง'}
            </button>
            {editId && (
              <button className="btn btn-secondary" type="button" onClick={() => { setEditId(null); setForm({ petName: '', petType: '', breed: '', age: '', note: '' }); }}>ยกเลิก</button>
            )}
          </div>
        </form>
        {loading ? (
          <div className="text-yellow-400">กำลังโหลด...</div>
        ) : pets.length === 0 ? (
          <div className="alert bg-yellow-100 text-yellow-700">ไม่มีข้อมูลสัตว์เลี้ยง</div>
        ) : (
          <div className="grid gap-6">
            {pets.map(pet => (
              <div key={pet._id} className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-white rounded-2xl shadow-lg border border-yellow-100 hover:shadow-xl transition-all">
                <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-yellow-50 border-2 border-yellow-200 shadow-inner">
                  <span className="text-4xl">
                    {pet.petType === 'แมว' ? '🐱' : pet.petType === 'สุนัข' ? '🐶' : '🐾'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-xl text-yellow-700 mb-1 truncate">{pet.petName}</div>
                  <div className="text-yellow-600 mb-1">ชนิด: <span className="font-semibold">{pet.petType}</span> | สายพันธุ์: <span className="font-semibold">{pet.breed}</span></div>
                  <div className="text-yellow-500 mb-1">อายุ: <span className="font-semibold">{pet.age}</span> ปี</div>
                  {pet.note && <div className="text-yellow-400 text-xs italic">หมายเหตุ: {pet.note}</div>}
                </div>
                <div className="flex flex-col gap-2 sm:gap-2 sm:flex-row">
                  <button className="btn btn-sm bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200 shadow" onClick={() => handleEdit(pet)}>
                    แก้ไข
                  </button>
                  <button className="btn btn-sm bg-red-100 text-red-700 border-red-300 hover:bg-red-200 shadow" onClick={() => handleDelete(pet._id)}>
                    ลบ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
