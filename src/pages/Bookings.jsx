import { useEffect, useState } from 'react';
import { deleteBooking, getBookingsByUser } from '../services/booking.service';
import { getPetsByUser } from '../services/pet.service';
import { getServices } from '../services/service.service';
import { useAuth } from '../context/AuthContext';



export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const { user } = useAuth();

  async function load() {
    if (!user) return;
    setLoading(true);
    try {
      const [bookingData, petData, serviceData] = await Promise.all([
        getBookingsByUser(user.id || user._id),
        getPetsByUser(user.id || user._id),
        getServices()
      ]);
      setBookings(bookingData || []);
      setPets(petData || []);
      setServices(serviceData || []);
    } catch (err) {
      setMsg(err.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [user]);

  function handleCancelBooking(id) {
    deleteBooking(id)
      .then(() => load())
      .catch(err => setMsg(err.response?.data?.message || err.message || 'Cancel failed'));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffbe6] to-white">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-yellow-700 drop-shadow">การจองบริการดูแลสัตว์เลี้ยงของฉัน</h1>
        {msg && <div className="alert alert-error bg-yellow-100 text-yellow-700">{msg}</div>}
        {loading ? (
          <div className="text-yellow-400">กำลังโหลด...</div>
        ) : bookings.length === 0 ? (
          <div className="alert bg-yellow-100 text-yellow-700">ไม่พบรายการจอง</div>
        ) : (
          <div className="grid gap-6">
            {bookings.map(b => {
              // Support both object and id for pet/service
              let pet = null;
              let service = null;
              if (typeof b.petId === 'object' && b.petId) {
                pet = b.petId;
              } else if (b.petId) {
                pet = pets.find(p => String(p._id) === String(b.petId));
              } else if (b.pet_id) {
                pet = b.pet_id;
              }
              if (typeof b.serviceId === 'object' && b.serviceId) {
                service = b.serviceId;
              } else if (b.serviceId) {
                service = services.find(s => String(s._id) === String(b.serviceId));
              } else if (b.service_id) {
                service = b.service_id;
              }
              return (
                <div key={b._id} className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-yellow-50 rounded-2xl shadow-lg border-2 border-yellow-200 hover:shadow-xl transition-all">
                  <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-white border-2 border-yellow-300 shadow-inner">
                    <span className="text-4xl">🐾</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-xl text-yellow-700 mb-1 truncate">{service?.name || '-'}</div>
                    <div className="text-yellow-600 mb-1">สัตว์เลี้ยง: <span className="font-semibold">{pet?.petName || '-'}</span></div>
                    <div className="text-yellow-500 mb-1">วัน-เวลา: <span className="font-semibold">{b.bookingDate ? `${b.bookingDate} ${b.bookingTime}` : '-'}</span></div>
                    <div className="text-yellow-400">สถานะ: <span className="font-semibold">{b.status}</span></div>
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-2 sm:flex-row">
                    <button className="btn btn-sm bg-red-100 text-red-700 border-red-300 hover:bg-red-200 shadow" onClick={() => handleCancelBooking(b._id)}>
                      ยกเลิก
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
