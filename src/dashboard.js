import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { Layout, ArrowLeft, Edit, Trash2, BoxIcon, TagIcon, Package2Icon, DollarSign, CalendarFoldIcon, Settings2Icon, Image } from 'lucide-react';
import './dashboard.css';

// Dashboard component to manage product data with search, edit, and delete functionalities
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
  const [isUpdating, setIsUpdating] = useState(false);


  // Fetches product data from the server with token-based authentication
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

  // Effect to fetch data on initial render or when the token is refreshed
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      fetchData(token);
    }
  }, [navigate, fetchData]);

  // Debounced search handler to filter products based on search term
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

  // Effect to run search whenever searchTerm changes
  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, handleSearch]);

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };


  // Handle edit action for a specific product
  const handleEdit = (product) => {
    setCurrentProduct(product);
    setUpdatedProduct({ ...product });
    setIsEditModalOpen(true);
  };

  // Handle quantity change and calculate total price during product update
  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value) || 0;
    const totalPrice = quantity * updatedProduct.price; 
    setUpdatedProduct({ ...updatedProduct, quantity, totalPrice });
  };

  const handlePriceChange = (e) => {
    const price = parseInt(e.target.value) || 0;
    const totalPrice = updatedProduct.quantity * price;  
    setUpdatedProduct({ ...updatedProduct, price, totalPrice });
  };



  // Handle product update after editing
  const handleUpdateProduct = async () => {
    try {
      setIsUpdating(true); // Set loading state
      const token = localStorage.getItem('token');

      const updatedData = {
        ...updatedProduct,
        date: new Date().toISOString() // Set tanggal terbaru saat update
      };

      await axios.put(`/products/${currentProduct._id}`, updatedProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update produk di state frontend
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === currentProduct._id ? { ...product, ...updatedData } : product
        )
      );

      setFilteredProducts((prevFilteredProducts) =>
        prevFilteredProducts.map((product) =>
          product._id === currentProduct._id ? { ...product, ...updatedData } : product
        )
      );

      setIsEditModalOpen(false);
      fetchData(token); // Refresh data setelah update
    } catch (error) {
      setError('Terjadi kesalahan saat mengupdate produk.');
    } finally {
      setIsUpdating(false); // Reset loading state
    }
  };


  // Handle product deletion confirmation
  const handleDeleteConfirmation = (product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Handle actual product deletion
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


  // Render loading state
  if (isLoading) {
    return <div className="loading">Memuat data...</div>;
  }

  // Render error state
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      {/* Navbar with title and user actions */}
      <nav className="bg-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Layout className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-white">Management Product</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/home')}
                className="flex items-center text-white hover:text-gray-400"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="dashboard-container p-5">
        {/* Search input and table header */}
        <input
          type="text"
          placeholder="Cari Semua Product dan Kategori..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        {/* Table with product data */}
        <table>
          <thead>
            <tr>
              <th
                className='text-center'>
                <span className='flex gap-2'>
                  <BoxIcon className='h-5 w-5' />
                  Nama Produk
                </span>
              </th>

              <th
                className='text-center'>
                <span className='flex gap-2'>
                  <TagIcon className='h-5 w-5' />
                  Kategori
                </span>
              </th>
              <th
                className='text-center'>
                <span className='flex gap-2'>
                  <Package2Icon className='h-5 w-5' />
                  Jumlah
                </span>
              </th>
              <th
                className='text-center'>
                <span className='flex gap-2'>
                  <DollarSign className='h-5 w-5' />
                  Harga Satuan
                </span>
              </th>
              <th
                className='text-center'>
                <span className='flex gap-2'>
                  <DollarSign className='h-5 w-5' />
                  Total Harga
                </span>
              </th>
              <th
                className='text-center'>
                <span className='flex gap-2'>
                  <CalendarFoldIcon className='h-5 w-5' />
                  Tanggal
                </span>
              </th>
              <th
                className='text-center'>
                <span className='flex gap-2'>
                  <Image className='h-5 w-5' />
                  Gambar
                </span>
              </th>
              <th
                className='text-center'>
                <span className='flex gap-2'>
                  <Settings2Icon className='h-5 w-5' />
                  Aksi
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Render table rows for each product */}
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td className='text-center'>{product.productName}</td>
                <td className='text-center'>{product.category}</td>
                <td className='text-center'>{product.quantity}</td>
                <td className='text-center'>Rp {product.price.toLocaleString()}</td>
                <td className='text-center'>Rp {product.totalPrice.toLocaleString()}</td>
                <td className='text-center'>{new Date(product.date).toLocaleDateString()}</td>
                <td>
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.productName}
                      className="w-24 h-24 object-cover "
                    />
                  )}
                </td>
                <td>
                  <div className="actions-buttons">
                    <button
                      className="text-slate-700 hover:text-blue-900"
                      onClick={() => handleEdit(product)}>
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteConfirmation(product)}>
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal for editing product data */}
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
                  <label>Harga Satuan</label>
                  <input
                    type="number"
                    value={updatedProduct.price || ''}
                    onChange={handlePriceChange}
                  />
                </div>
                <div className="form-actions">
                  <button className="button button-outline" onClick={handleUpdateProduct} disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Updating...
                      </>
                    ) : (
                      'Update'
                    )}
                  </button>
                  <button className="button button-destructive" onClick={() => setIsEditModalOpen(false)}>Batal</button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Modal for deleting product data */}
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
    </div>
  );
};

export default Dashboard;
