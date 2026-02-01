import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById } from '../services/service.service';
import { createBooking } from '../services/booking.service';
import { getPetsByUser } from '../services/pet.service';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [petId, setPetId] = useState('');
  const [pets, setPets] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    getServiceById(id)
      .then(data => setService(data))
      .catch(err => setMessage(err.message || 'ไม่สามารถโหลดข้อมูล'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    // โหลดรายชื่อสัตว์เลี้ยงของผู้ใช้
    if (!user) return;
    getPetsByUser(user.id || user._id)
      .then(data => setPets(data || []))
      .catch(() => setPets([]));
  }, [user]);


  function bookNow(){
    const token = localStorage.getItem('token');
    if(!token){
      navigate('/login');
      return;
    }
    if(!appointmentDate || !appointmentTime){
      setMessage('กรุณาเลือกวันและเวลา');
      return;
    }
    if(!petId){
      setMessage('กรุณาเลือกสัตว์เลี้ยง');
      return;
    }
    createBooking({
      bookingDate: appointmentDate,
      bookingTime: appointmentTime,
      serviceId: id,
      petId,
      customerName: user?.name || '',
      phone: user?.phone || ''
    })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'จองสำเร็จ',
          text: 'การจองของคุณถูกบันทึกเรียบร้อย!',
          confirmButtonColor: '#eab308',
        }).then(() => navigate('/bookings'));
      })
      .catch(err => setMessage(err.response?.data?.message || err.message || 'จองไม่สำเร็จ'));
  }

  if(loading) return <div className="p-4 bg-[#fffbe6] min-h-screen">Loading...</div>;
  if(!service) return <div className="p-4 bg-[#fffbe6] min-h-screen">{message || 'Service not found'}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffbe6] to-white">
      <div className="container mx-auto p-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <img src={service.imageUrl || '/vite.svg'} alt={service.name + ' - บริการสัตว์เลี้ยง'} className="w-full h-96 object-cover rounded-xl border border-blue-100 bg-white" />
          </div>
          <div className="p-4 bg-white rounded-xl shadow border border-yellow-100">
            <h1 className="text-2xl font-bold text-yellow-700">{service.name}</h1>
            <p className="mt-2 text-yellow-600">{service.description}</p>
            <div className="mt-4 text-xl font-semibold text-yellow-800">฿{service.price}</div>
            <div className="mt-6 flex flex-col gap-2">
              <label className="label text-yellow-700">เลือกสัตว์เลี้ยง</label>
              <select className="input input-bordered w-full border-yellow-200 focus:border-yellow-400" value={petId} onChange={e=>setPetId(e.target.value)}>
                <option value="">-- เลือกสัตว์เลี้ยง --</option>
                {pets.map(pet => <option key={pet._id} value={pet._id}>{pet.petName} ({pet.petType})</option>)}
              </select>
              <label className="label text-yellow-700 mt-2">วันที่</label>
              <input type="date" value={appointmentDate} onChange={e=>setAppointmentDate(e.target.value)} className="input input-bordered w-full border-yellow-200 focus:border-yellow-400" />
              <label className="label text-yellow-700 mt-2">เวลา</label>
              <input type="time" value={appointmentTime} onChange={e=>setAppointmentTime(e.target.value)} className="input input-bordered w-full border-yellow-200 focus:border-yellow-400" />
              <button className="btn btn-primary mt-4 w-full" onClick={bookNow}>จองบริการดูแลสัตว์เลี้ยง</button>
              {message && <div className="alert mt-4 bg-yellow-100 text-yellow-700">{message}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
