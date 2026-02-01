import { useEffect, useState } from 'react';
import { getServices } from '../services/service.service';
import ServiceCard from '../components/ServiceCard';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getServices()
      .then(data => setServices(data))
      .catch(err => setError(err.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffbe6] to-white">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-yellow-700 drop-shadow">บริการดูแลสัตว์เลี้ยง</h1>
        {loading && <div className="alert bg-yellow-100 text-yellow-700">กำลังโหลด...</div>}
        {error && <div className="alert alert-error bg-yellow-100 text-yellow-700">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map(svc => (
            <ServiceCard key={svc._id} svc={svc} />
          ))}
        </div>
      </div>
    </div>
  );
}
