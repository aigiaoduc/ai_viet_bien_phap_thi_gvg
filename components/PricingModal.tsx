import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PricingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const packages = [
    { name: 'Thử nghiệm', credits: '5 lượt', price: '100.000', perCredit: '20.000', note: 'Dành cho thử nghiệm' },
    { name: 'Cơ bản', credits: '10 lượt', price: '180.000', perCredit: '18.000', note: 'Tiết kiệm hơn Starter' },
    { name: 'Tiêu chuẩn', credits: '20 lượt', price: '340.000', perCredit: '17.000', note: 'Gói phổ biến', isPopular: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden animate-fade-in-up my-4 relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white text-center relative">
             <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
             <h2 className="text-2xl font-bold uppercase tracking-wide">Tài khoản đã hết lượt</h2>
             <p className="opacity-90 mt-1 text-sm">Vui lòng nạp thêm để tiếp tục sử dụng dịch vụ AI chuyên nghiệp</p>
        </div>

        <div className="p-6 sm:p-8 bg-gray-50">
            {/* Pricing Table */}
            <div className="overflow-x-auto mb-8 rounded-xl border border-gray-200 shadow-lg bg-white">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-white uppercase bg-gray-800">
                        <tr>
                            <th className="px-4 py-4">Gói dịch vụ</th>
                            <th className="px-4 py-4">Số lượt</th>
                            <th className="px-4 py-4">Giá (VNĐ)</th>
                            <th className="px-4 py-4 whitespace-nowrap">Giá/lượt</th>
                            <th className="px-4 py-4">Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {packages.map((pkg, index) => (
                            <tr key={index} className={`transition-colors ${pkg.isPopular ? 'bg-yellow-50 hover:bg-yellow-100' : 'bg-white hover:bg-gray-50'}`}>
                                <td className="px-4 py-4 font-bold text-gray-900 text-base">
                                    {pkg.name}
                                    {pkg.isPopular && <span className="ml-2 text-[10px] bg-red-600 text-white px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">Hot</span>}
                                </td>
                                <td className="px-4 py-4 font-bold text-indigo-600 text-base">{pkg.credits}</td>
                                <td className="px-4 py-4 font-bold text-red-600 text-base">{pkg.price}</td>
                                <td className="px-4 py-4 text-gray-500">{pkg.perCredit}</td>
                                <td className="px-4 py-4 text-xs italic text-gray-500">{pkg.note}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Info Section */}
            <div className="grid md:grid-cols-12 gap-6">
                {/* QR Code Column */}
                <div className="md:col-span-4 flex flex-col items-center justify-center bg-white p-4 rounded-2xl shadow-md border border-gray-200">
                    <div className="w-full max-w-[200px] aspect-square bg-gray-200 rounded-lg overflow-hidden mb-3 relative group">
                        {/* QR Code Image */}
                        <img
                            src="https://res.cloudinary.com/dejnvixvn/image/upload/v1763528268/z7240006634341_beff3d9a3b81b070647071be92b1ceb5_rf6neu.jpg"
                            alt="QR Code Chuyen Khoan"
                            className="w-full h-full object-cover"
                        />
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all"></div>
                    </div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Quét mã QR ngân hàng</p>
                </div>

                {/* Contact & Syntax Column */}
                <div className="md:col-span-8 flex flex-col justify-between gap-4">
                    {/* Transfer Syntax */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-indigo-500">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-lg">
                            <span className="bg-indigo-100 p-1.5 rounded-full text-indigo-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            </span>
                            Nội dung chuyển khoản (Bắt buộc):
                        </h3>
                        <div className="bg-gray-100 p-4 rounded-xl border border-gray-300 text-indigo-900 font-mono font-bold text-lg break-all text-center shadow-inner select-all">
                            AI Sáng kiến - Họ và tên - Gói
                        </div>
                        <p className="text-sm text-gray-500 mt-2 text-center italic">
                            Ví dụ: <span className="text-gray-700">AI Sáng kiến - Nguyen Van A - Goi Co Ban</span>
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-indigo-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                             </div>
                             <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase">Liên hệ Admin</h3>
                                <p className="text-xl font-bold text-indigo-900">Thầy Quân</p>
                             </div>
                        </div>
                        <div className="text-center sm:text-right bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
                            <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Hotline / Zalo</p>
                            <p className="text-2xl font-extrabold text-red-600 tracking-tight">0355.213.107</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <button 
                    onClick={onClose}
                    className="px-12 py-4 bg-gray-900 text-white font-bold text-lg rounded-2xl hover:bg-gray-800 hover:shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0"
                >
                    Đóng cửa sổ
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;