import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './app.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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
            {/* <div className="card-header">
              <h3>Login</h3>
            </div> */}
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
                <button
                  type="submit"
                  className="button button-outline w-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.383-1.921a6 6 0 01-1.383-3.37H2a8 8 0 004 7.291z"
                        ></path>
                      </svg>
                      Loading...
                    </div>
                  ) : (
                    'Login'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
