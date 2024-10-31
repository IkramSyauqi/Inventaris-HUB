import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './app.css';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    try {
      // Akses API melalui proxy
      const response = await axios.post('/users/login', {  
        username,
        password,
      });

      if (response.status === 200) {
        // Simpan token ke localStorage dan arahkan ke dashboard
        localStorage.setItem('token', response.data.token);
        navigate('/home');
      }
    } catch (error) {
      setError('Login gagal, periksa username dan password Anda.');
    }
  };

  return (
    <div className="container dark:bg-gray-900">
      <div className="row justify-content-center items-center align-items-center vh-100">
        <div className="col-md-4 col-sm-8 col-10">
          <div className="card dark:bg-zinc-200">
          <h1 className='text-center text-gray-950'>INVENTARIS HUB</h1>

            <div className="card-body dark:bg-gray-900 border-2 border-white rounded-lg">
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
                <button type="submit" className="button-outline dark:bg-gray-300 focus:text-white  w-100">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
