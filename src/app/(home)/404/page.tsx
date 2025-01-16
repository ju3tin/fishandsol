import React from 'react';
import { Link } from 'react-router-dom'; // Or 'next/link' if you're using Next.js

export default function NotFoundPage() {
    return (
<div id="container12" className="container default pt-4">
    <div className="wrapper1">
        <div className="inner">
        <h1>404</h1>
                    <h2>Page Not Found</h2>
                    <p>
                        Oops! The page you are looking for does not exist or has been moved.
                    </p>

     <Link to="/">
                        Go back to Home
                    </Link>
     </div>
    </div>
</div>
)}