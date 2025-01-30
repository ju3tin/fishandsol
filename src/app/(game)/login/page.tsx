// pages/index.js
// Add this line at the top of your file
"use client";
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>Welcome to My Next.js App</h1>
      {session ? (
        <>
          {session?.user ? (
            <>
              <p>Signed in as {session.user.name}</p>
              <button onClick={() => signOut()}>Sign out</button>
            </>
          ) : (
            <p>Not signed in</p>
          )}
        </>
      ) : (
        <>
          <p>Not signed in</p>
          <button onClick={() => signIn('twitter')}>Sign in with Twitter</button>
        </>
      )}
    </div>
  );
}