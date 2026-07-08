import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
    return (
        <div className="layout-container">
            <Header />
            <main className="layout-content">
                <Outlet />
            </main>
        </div>
    );
}
