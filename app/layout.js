import "./globals.css";
import { Roboto } from 'next/font/google';
import { ConvexClientProvider } from "./Provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "../components/ui/toaster"



const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700']
});


export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${roboto.className}`}
        >
          <ConvexClientProvider>
            <Toaster />
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
