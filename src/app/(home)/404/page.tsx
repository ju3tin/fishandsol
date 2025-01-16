import React from 'react';
import { Link } from 'react-router-dom'; // Or 'next/link' if you're using Next.js

export default function NotFoundPage() {
    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f8f9fa',
            color: '#333',
            textAlign: 'center',
        },
        content: {
            maxWidth: '500px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
            borderRadius: '8px',
        },
        errorCode: {
            fontSize: '72px',
            margin: '0',
        },
        message: {
            fontSize: '24px',
            margin: '10px 0',
        },
        description: {
            fontSize: '16px',
            margin: '10px 0 20px',
        },
        homeLink: {
            display: 'inline-block',
            padding: '10px 20px',
            fontSize: '16px',
            color: '#fff',
            backgroundColor: '#007bff',
            textDecoration: 'none',
            borderRadius: '4px',
        },
    };

    return (
        <div id="container12" className="container default pt-4">
            <div style={styles.container}>
                <div style={styles.content}>
                    <h1 style={styles.errorCode}>404</h1>
                    <h2 style={styles.message}>Page Not Found</h2>
                    <p style={styles.description}>
                        Oops! The page you are looking for does not exist or has been moved.
                    </p>
                    <Link to="/" style={styles.homeLink}>
                        Go back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}