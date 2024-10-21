import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import './dashboard.css';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchData = useCallback(async (token) => {
    try {
      const response = await axios.get('/products', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.products && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      } else {
        throw new Error('Format data tidak sesuai');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setError('Sesi Anda telah berakhir. Silakan login kembali.');
        localStorage.removeItem('token');
        navigate('/');
      } else {
        setError(error.message || 'Terjadi kesalahan saat memuat data');
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      fetchData(token);
    }
  }, [navigate, fetchData]);

  const handleSearch = useCallback(
    debounce((term) => {
      const filtered = products.filter(product =>
        product.productName.toLowerCase().includes(term.toLowerCase()) ||
        product.category.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProducts(filtered);
    }, 300),
    [products]
  );

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setUpdatedProduct({ ...product });
    setIsEditModalOpen(true);
  };

  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value) || 0;
    const totalPrice = updatedProduct.price * quantity;
    setUpdatedProduct({ ...updatedProduct, quantity, totalPrice });
  };

  const handleUpdateProduct = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(`/products/${currentProduct._id}`, updatedProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsEditModalOpen(false);
      fetchData(token);
    } catch (error) {
      setError('Terjadi kesalahan saat mengupdate produk.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirmation = (product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(`/products/${currentProduct._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsDeleteModalOpen(false);
      fetchData(token);
    } catch (error) {
      setError('Terjadi kesalahan saat menghapus produk.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Memuat data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard-container p-5">
      <h1>INVENTARIS HUB</h1>
      <input
        type="text"
        placeholder="Cari Semua Product dan Kategori,,,"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <table>
        <thead>
          <tr>
            <th>Nama Produk</th>
            <th>Kategori</th>
            <th>Jumlah</th>
            <th>Harga Satuan</th>
            <th>Total Harga</th>
            <th>Tanggal</th>
            <th>Gambar</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id}>
              <td>{product.productName}</td>
              <td>{product.category}</td>
              <td>{product.quantity}</td>
              <td>Rp {product.price.toLocaleString()}</td>
              <td>Rp {product.totalPrice.toLocaleString()}</td>
              <td>{new Date(product.date).toLocaleDateString()}</td>
              <td>
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-24 h-24 object-cover"
                  />
                )}
              </td>
              <td>
                <div className="actions-buttons">
                  <button className="button button-outline" onClick={() => handleEdit(product)}>Edit</button>
                  <button className="button button-destructive" onClick={() => handleDeleteConfirmation(product)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditModalOpen && (
        <>
          <div className="overlay" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="modal">
            <div className="modal-content">
              <h2 className="text-center text-xl mb-4">Edit Produk</h2>
              <div className="form-group">
                <label>Nama Produk</label>
                <input
                  type="text"
                  value={updatedProduct.productName || ''}
                  onChange={(e) => setUpdatedProduct({ ...updatedProduct, productName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Kategori</label>
                <input
                  type="text"
                  value={updatedProduct.category || ''}
                  onChange={(e) => setUpdatedProduct({ ...updatedProduct, category: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Jumlah</label>
                <input
                  type="number"
                  value={updatedProduct.quantity || ''}
                  onChange={handleQuantityChange}
                />
              </div>
              <div className="form-group">
                <label>Total Harga</label>
                <input
                  type="text"
                  value={`Rp ${updatedProduct.totalPrice?.toLocaleString() || ''}`}
                  disabled
                />
              </div>
              <div className="form-actions">
                <button className="button button-outline" onClick={handleUpdateProduct}>Update</button>
                <button className="button button-destructive" onClick={() => setIsEditModalOpen(false)}>Batal</button>
              </div>
            </div>
          </div>

        </>
      )}

      {isDeleteModalOpen && (

        <>
          <div className="overlay" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="modal">
            <div className="modal-content">
              <h2 className='modal-title'>Hapus Produk</h2>
              <p className='modal-desc'>Apakah Anda yakin ingin menghapus produk "{currentProduct?.productName}"?</p>
              <div className="form-actions">
                <button className="button button-outline" onClick={handleDelete}>Hapus</button>
                <button className="button button-destructive" onClick={() => setIsDeleteModalOpen(false)}>Batal</button>
              </div>
            </div>
          </div>

        </>
      )}

    </div>
  );
};

export default Dashboard;