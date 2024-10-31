import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, User, Package, LogOut } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 ">
            {/* Navbar */}
            <nav className="dark:bg-gray-900 rounded-lg">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Layout className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                                INVENTARIS HUB
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            <LogOut className="h-5 w-5 mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8 pt-20">
                <h1 className="text-3xl font-bold text-center mb-20 text-gray-900 dark:text-white">
                    Welcome to Inventaris Dashboard
                </h1>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* User Dashboard Card */}
                    <div
                        onClick={() => navigate('/dashboard-user')}
                        className="dark:bg-gray-800 p-6 rounded-lg shadow-xl hover:shadow-lg dark:hover:shadow-slate-50 transition-shadow cursor-pointer dark:border-gray-700"
                    >
                        <div className="flex items-center justify-center mb-4">
                            <User className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white">
                            User Management
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
                            Manage user accounts, roles, and permissions
                        </p>
                    </div>

                    {/* Product Dashboard Card */}
                    <div
                        onClick={() => navigate('/dashboard')}
                        className="dark:bg-gray-800 p-6 rounded-lg shadow-xl hover:shadow-lg dark:hover:shadow-slate-50 transition-shadow cursor-pointer dark:border-gray-700"
                    >
                        <div className="flex items-center justify-center mb-4">
                            <Package className="h-16 w-16 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white">
                            Product Management
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
                            Manage inventory, products, and categories
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;