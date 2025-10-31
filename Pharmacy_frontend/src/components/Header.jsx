import React from 'react';

const Header = () => {
    return (
        <header className="bg-blue-500 text-white p-4">
            <h1 className="text-2xl">Pharmacy Frontend</h1>
            <nav>
                <ul className="flex space-x-4">
                    <li><a href="/" className="hover:underline">Home</a></li>
                    <li><a href="/pharmacy" className="hover:underline">Pharmacy</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;