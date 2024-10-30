import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, User, Package, LogOutIcon } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleNavigation = (path) => {
        setIsLoading(true);
        setTimeout(() => {
            navigate(path);
        }, 1000); // memberikan jeda 1 detik untuk loading screen
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Layout className="h-8 w-8 text-blue-600" />
                            <span className="ml-2 text-xl font-bold">INVENTARIS HUB</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                        >
                            <LogOutIcon className="h-6 w-6 mr-2"/>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Loading Screen */}
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
                    <div className="flex items-center">
                        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                        <span className="ml-4 text-xl font-medium text-gray-700">Loading...</span>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8 pt-20">
                <h1 className="text-3xl font-bold text-center mb-8">Welcome to Admin Dashboard</h1>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* User Dashboard Card */}
                    <div
                        onClick={() => handleNavigation('/profile')}
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl transition-shadow cursor-pointer"
                    >
                        <div className="flex items-center justify-center mb-4">
                            <User className="h-16 w-16 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-center">User Management</h2>
                        <p className="text-gray-600 text-center mt-2">
                            Manage user accounts, roles, and permissions
                        </p>
                    </div>

                    {/* Product Dashboard Card */}
                    <div
                        onClick={() => handleNavigation('/dashboard')}
                        className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl transition-shadow cursor-pointer"
                    >
                        <div className="flex items-center justify-center mb-4">
                            <Package className="h-16 w-16 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-center">Product Management</h2>
                        <p className="text-gray-600 text-center mt-2">
                            Manage inventory, products, and categories
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
