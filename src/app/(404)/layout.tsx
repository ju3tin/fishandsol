// app/layout.tsx
import type { ReactNode } from "react";
//import { Providers } from "./providers"; // Import the wrapper

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}