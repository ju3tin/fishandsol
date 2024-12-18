import React from 'react';

const CustomPageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div style={{ padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <header style={{ marginBottom: '30px', textAlign: 'center' }}>
                <h1 style={{ color: '#333' }}>Custom Page Layout Header</h1>
                <p style={{ fontStyle: 'italic' }}>This layout is unique to this page.</p>
            </header>
            <main style={{ marginBottom: '30px' }}>
                {children}
            </main>
            <footer style={{ textAlign: 'center', color: '#666' }}>
                <p>Custom Page Layout Footer</p>
            </footer>
        </div>
    );
};

export default CustomPageLayout; 