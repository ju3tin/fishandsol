"use client"; // Ensure this is a client component

import { useSession } from 'next-auth/react';

export default function NotFoundPage() {
  const { data: session } = useSession();

  return (
    <div className="container default pt-4">
      <h1>Error 404</h1>
     
    </div>
  );
}