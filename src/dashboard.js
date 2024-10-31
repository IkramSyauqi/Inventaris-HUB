import React, { useEffect, useState, useCallback, useRef } from 'react';
import './dashboard.css';
import axios from 'axios';

import LoadingScreen from './components/loadingScreen';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import {
  Layout, ArrowLeft, Edit,
  Trash2, BoxIcon, TagIcon,
  Package2Icon, DollarSign,
  CalendarFoldIcon, Settings2Icon,
  Image, Camera
} from 'lucide-react';

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
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);


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

  const safeString = (value) => {
    return value ? value.toString().toLowerCase() : '';
  };

  // Debounced search handler to filter products based on search term
  const handleSearch = useCallback(
    debounce((term) => {
      const searchTerm = safeString(term);
      const filtered = products.filter(product => {
        const productName = safeString(product?.productName);
        const category = safeString(product?.category);

        return productName.includes(searchTerm) ||
          category.includes(searchTerm);
      });
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
    const totalPrice = quantity * updatedProduct.price;  // Hitung total harga baru
    setUpdatedProduct({ ...updatedProduct, quantity, totalPrice });
  };

  const handlePriceChange = (e) => {
    const price = parseInt(e.target.value) || 0;
    const totalPrice = updatedProduct.quantity * price;  // Hitung total harga baru
    setUpdatedProduct({ ...updatedProduct, price, totalPrice });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Save the file object
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const handleChangeImageClick = () => {
    fileInputRef.current?.click();
  };


  // Handle product update after editing
  const handleUpdateProduct = async () => {
    try {
      setIsUpdating(true); // Set loading state
      const token = localStorage.getItem('token');

      // Create FormData object to handle file upload
      const formData = new FormData();

      // Add all product fields to FormData
      formData.append('productName', updatedProduct.productName);
      formData.append('category', updatedProduct.category);
      formData.append('quantity', updatedProduct.quantity);
      formData.append('price', updatedProduct.price);
      formData.append('totalPrice', updatedProduct.totalPrice);
      formData.append('date', new Date().toISOString());

      // Only append new image if one was selected
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      // Make PUT request with FormData
      const response = await axios.put(
        `/products/${currentProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      // Update local state with response data
      const updatedProductData = response.data;

      // Update produk di state frontend
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === currentProduct._id ? updatedProductData : product
        )
      );

      setFilteredProducts((prevFilteredProducts) =>
        prevFilteredProducts.map((product) =>
          product._id === currentProduct._id ? updatedProductData : product
        )
      );
      // Reset states
      setIsEditModalOpen(false);
      setPreviewImage(null);
      setSelectedFile(null);
      setCurrentProduct(null);
      setUpdatedProduct({});


      fetchData(token); // Refresh data setelah update
    } catch (error) {
      console.error('Update error:', error);
      setError(
        error.response?.data?.message ||
        'Terjadi kesalahan saat mengupdate produk.'
      );
    } finally {
      setIsUpdating(false);
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
      setIsDeleting(true); // Set deleting state
      const token = localStorage.getItem('token');
      await axios.delete(`/products/${currentProduct._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsDeleteModalOpen(false);
      fetchData(token);
    } catch (error) {
      setError('Terjadi kesalahan saat menghapus produk.');
    } finally {
      setIsDeleting(false); // Reset deleting state
    }
  };

  useEffect(() => {
    if (isEditModalOpen && currentProduct) {
      setPreviewImage(currentProduct.image);
      setSelectedFile(null);
    }
  }, [isEditModalOpen, currentProduct]);

  // Render loading state
  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  const formatPrice = (price) => {
    return price ? price.toLocaleString() : '0';
  };

  // Render error state
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      {/* Navbar with title and user actions */}
      <nav className=" dark:bg-gray-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Layout className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-500 dark:text-white">Management Product</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/home')}
                className="flex items-center text-gray-500 dark:text-white hover:text-gray-400"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="dashboard-container p-5 dark:bg-gray-900 text-black ">
        {/* Search input and table header */}
        <input
          type="text"
          placeholder="Cari Semua Product dan Kategori..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        {/* Table with product data */}
        <table className='bg-gray-200'>
          <thead className='bg-gray-200'>
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
                <td className='text-center'>
                  Rp {formatPrice(product.totalPrice)}
                </td>
                <td className='text-center'>
                  {product.date ? new Date(product.date).toLocaleDateString() : '-'}
                </td>
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

                {/* Image Preview Section */}
                <div className="form-group">
                  <label>Gambar Produk</label>
                  <div className="relative w-full h-64 mb-4 group">
                    <img
                      src={previewImage || currentProduct.image || '/placeholder-image.jpg'}
                      alt="Product preview"
                      className="w-full h-full object-contain border rounded-lg"
                    />

                    {/* Hover Overlay with Change Picture Button */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
                      <button
                        onClick={handleChangeImageClick}
                        className="bg-white text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 z-1000 hover:bg-red-500"
                      >
                        <Camera className="h-5 w-5" />
                        Change Picture
                      </button>
                    </div>

                    {/* Hidden File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Existing Form Fields */}
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
                      <div className='mr-4'>
                        <i className="fas fa-spinner fa-spin"></i> Updating...
                      </div>
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
                  <button className="button button-outline" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? (<><i className="fas fa-spinner fa-spin"></i> Menghapus...</>
                    ) : ('Hapus')}</button>
                  <button className="button button-destructive" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
                    Batal
                  </button>
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