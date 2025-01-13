import React from 'react';

const Test2Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div style={{ padding: '20px', backgroundColor: '#e0e0e0', borderRadius: '8px' }}>
            <header style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h1>Test2 Page Layout Header</h1>
                <p>This layout is specific to the Test2 page.</p>
            </header>
            <main>{children}</main>
            <footer style={{ textAlign: 'center' }}>
                <p>Test2 Page Layout Footer</p>
            </footer>
        </div>
    );
};

export default Test2Layout; 