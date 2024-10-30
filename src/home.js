import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, User, Package, LogOutIcon } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
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

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8 pt-20">
                <h1 className="text-3xl font-bold text-center mb-8">Welcome to Admin Dashboard</h1>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* User Dashboard Card */}
                    <div
                        onClick={() => navigate('/profile')}
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
                        onClick={() => navigate('/dashboard')}
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
