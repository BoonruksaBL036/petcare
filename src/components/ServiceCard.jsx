import { Link } from 'react-router-dom';

export default function ServiceCard({ svc }) {
  return (
    <div className="group bg-white rounded-3xl shadow-xl border-2 border-yellow-100 p-0 flex flex-col transition-transform hover:-translate-y-1 hover:shadow-2xl overflow-hidden relative">
      <div className="relative">
        <img
          src={svc.imageUrl || '/vite.svg'}
          alt={svc.name + ' - บริการสัตว์เลี้ยง'}
          className="w-full h-48 object-cover bg-[#fffbe6] border-b-2 border-yellow-50"
        />
        <span className="absolute top-3 left-3 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow">บริการ</span>
      </div>
      <div className="flex-1 flex flex-col gap-1 px-5 py-4">
        <div className="font-extrabold text-yellow-700 text-xl mb-1 truncate">{svc.name}</div>
        <div className="text-yellow-600 font-bold text-lg mb-1">฿{svc.price}</div>
        <div className="text-yellow-500 text-sm mb-2 line-clamp-2 min-h-[2.5em]">{svc.description}</div>
        <Link
          to={`/services/${svc._id}`}
          className="btn btn-outline border-yellow-400 text-yellow-700 hover:bg-yellow-400 hover:text-white mt-auto rounded-full transition font-semibold shadow-none"
        >
          ดูรายละเอียด
        </Link>
      </div>
    </div>
  );
}
