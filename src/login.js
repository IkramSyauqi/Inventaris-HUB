import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './app.css';
import Home from './home';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', { username });
      const response = await axios.post('/users/login', {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        withCredentials: true,
      });

      console.log('Login response:', response.status, response.data);

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        // Tambahan: Simpan role user jika ada dalam response
        if (response.data.role) {
          localStorage.setItem('userRole', response.data.role);
        }
        navigate('/home');
      } else {
        setError('Response tidak valid dari server');
      }
    } catch (err) {
      // Error handling yang lebih detail
      if (err.response) {
        // Server meresponse dengan status error
        switch (err.response.status) {
          case 401:
            setError('Username atau password salah');
            break;
          case 404:
            setError('Server tidak ditemukan');
            break;
          case 500:
            setError('Terjadi kesalahan pada server');
            break;
          default:
            setError('Login gagal: ' + (err.response.data?.message || 'Unknown error'));
        }
      } else if (err.request) {
        // Request dibuat tapi tidak ada response
        setError('Tidak dapat terhubung ke server');
      } else {
        // Error lainnya
        setError('Terjadi kesalahan: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center items-center align-items-center vh-100">
        <div className="col-md-4 col-sm-8 col-10">
          <div className="card">
          <h1>INVENTARIS HUB</h1>
            <div className="card-header">
              <h3>Login</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    placeholder="Masukkan Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Masukkan Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="button button-outline w-100">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
