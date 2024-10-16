import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      fetchData(token);
    }
  }, [navigate]);

  const fetchData = async (token) => {
    try {
      const response = await axios.get('/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Data dari API:', response.data);

      if (response.data && response.data.products && Array.isArray(response.data.products) && response.data.products.length > 0) {
        setProducts(response.data.products); // Mengatur state dengan array produk
      }else {
        console.log('Format data tidak sesuai');
        setError('Format data tidak sesuai, Periksa Kembali');
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Gagal memuat data produk:', error);
      setError(error.response?.data?.message || 'Terjadi kesalahan saat memuat data');
      if (error.response) {
        if (error.response.status === 401) {
          setError('Token tidak valid atau kadaluarsa. Silakan login kembali.');
          localStorage.removeItem('token');
          navigate('/');
        } else {
          setError(`Terjadi kesalahan: ${error.response.data.message || error.message}`);
        }
      } else {
        setError('Terjadi kesalahan saat memuat data. Periksa koneksi internet Anda.');
      }
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center mt-8">Memuat data...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
    {/* Tambahkan judul Inventaris Hub */}
    <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Inventaris Hub</h1>
    
    <h1 className="text-3xl font-bold mb-6 text-center text-white bg-gray-800 py-4 rounded">Dashboard Inventaris</h1>
      {products.length > 0 ? (
        <table className="table-auto w-full text-left bg-white shadow-md rounded mt-6">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Nama Produk</th>
              <th className="px-4 py-2">Kategori</th>
              <th className="px-4 py-2">Jumlah</th>
              <th className="px-4 py-2">Harga Satuan</th>
              <th className="px-4 py-2">Total Harga</th>
              <th className="px-4 py-2">Tanggal</th>
              <th className="px-4 py-2">Gambar</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="px-4 py-2">{product._id}</td>
                <td className="px-4 py-2">{product.productName}</td>
                <td className="px-4 py-2">{product.category}</td>
                <td className="px-4 py-2">{product.quantity}</td>
                <td className="px-4 py-2">Rp {product.price.toLocaleString()}</td>
                <td className="px-4 py-2">Rp {product.totalPrice.toLocaleString()}</td>
                <td className="px-4 py-2">{new Date(product.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  {product.image && (
                    <img
                      src={`https://inventaris-app-backend.vercel.app${product.image}`}
                      alt={product.productName}
                      className="w-24 h-24 object-cover"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center mt-4">Tidak ada data produk tersedia</p>
      )}
    </div>
  );
};

export default Dashboard;
