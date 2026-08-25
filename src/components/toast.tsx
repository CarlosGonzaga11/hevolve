import type { ReactNode } from "react";
import { Toaster } from "sonner";


interface RootLayoutProps {
  children: ReactNode;
}
export default function RootLayout({ children }:RootLayoutProps) {
  return (
    <html lang="en">
      <head />
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}