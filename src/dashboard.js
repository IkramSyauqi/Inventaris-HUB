import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); // Produk yang sedang diedit
  const [updatedProduct, setUpdatedProduct] = useState({}); // Data produk yang diedit
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

      if (response.data && response.data.products && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
        setError('Format data tidak sesuai, Periksa Kembali');
      }

      setIsLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Terjadi kesalahan saat memuat data');
      if (error.response) {
        if (error.response.status === 401) {
          setError('Token tidak valid atau kadaluarsa. Silakan login kembali.');
          localStorage.removeItem('token');
          navigate('/');
        }
      }
      setIsLoading(false);
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setUpdatedProduct({ ...product }); // Set data produk untuk diedit
    setIsEditModalOpen(true); // Buka modal edit
  };

  // Menghitung total harga otomatis berdasarkan harga satuan dan jumlah produk
  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value) || 0;
    const totalPrice = updatedProduct.price * quantity;
    setUpdatedProduct({ ...updatedProduct, quantity, totalPrice });
  };

  const handleUpdateProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/products/${currentProduct._id}`, updatedProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Produk berhasil diupdate.');
      setIsEditModalOpen(false);
      fetchData(token); // Refresh data setelah update
    } catch (error) {
      alert('Terjadi kesalahan saat mengupdate produk.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Produk berhasil dihapus.');
        fetchData(token);
      } catch (error) {
        alert('Terjadi kesalahan saat menghapus produk.');
      }
    }
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
  };

  if (isLoading) {
    return <div className="text-center mt-8">Memuat data...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
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
              <th className="px-4 py-2 text-center">Aksi</th>
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
                <td className="px-4 py-2">
                  <div className="actions-buttons">
                    <button onClick={() => handleEdit(product)} className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
                    <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center mt-4">Tidak ada data produk tersedia</p>
      )}

      {/* Modal Edit Produk */}
      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Produk</h2>
            <div className="form-group">
              <label>Nama Produk</label>
              <input
                type="text"
                value={updatedProduct.productName}
                onChange={(e) => setUpdatedProduct({ ...updatedProduct, productName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Kategori</label>
              <input
                type="text"
                value={updatedProduct.category}
                onChange={(e) => setUpdatedProduct({ ...updatedProduct, category: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Jumlah</label>
              <input
                type="number"
                value={updatedProduct.quantity}
                onChange={handleQuantityChange} // Panggil fungsi handleQuantityChange
              />
            </div>
            <div className="form-group">
              <label>Total Harga</label>
              <input
                type="text"
                value={`Rp ${updatedProduct.totalPrice.toLocaleString()}`}
                disabled
              />
            </div>
            <div className="form-actions">
              <button onClick={handleUpdateProduct} className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
              <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded">Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
