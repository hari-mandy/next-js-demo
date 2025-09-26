'use client';
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apollo';
import { CartProvider } from 'use-shopping-cart';
import './globals.css';
import { useEffect } from 'react';
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // Next.js _app.tsx or a layout component
  useEffect(() => {
    (async () => {
      const res = await fetch("http://headlesswordpress.local/wp-json/headless/v1/global-styles.css");
      const css = await res.text();
      const style = document.createElement('style');
      style.setAttribute('data-wp-global-styles', 'true');
      style.appendChild(document.createTextNode(css));
      document.head.appendChild(style);
    })();
  }, []);


  return (
    <html lang="en">
      
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>
        <ApolloProvider client={client}>
          <AuthProvider>
            <CartProvider
              mode="payment"
              cartMode="client-only"
              stripe=''
              currency="USD"
              shouldPersist
              successUrl={`${process.env.NEXT_PUBLIC_SITE_URL}/success`}
              cancelUrl={`${process.env.NEXT_PUBLIC_SITE_URL}/cancel`}
            >
              {children}
              <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
            </CartProvider>
          </AuthProvider>
        </ApolloProvider>
        {/* <script src="https://cdn.tailwindcss.com"></script> */}
        {/* Core WordPress styles */}

        {/* <link rel="stylesheet" href="http://headlesswordpress.local/wp-includes/css/dist/block-library/style.min.css" />
        <link rel="stylesheet" href="http://headlesswordpress.local/wp-includes/css/dist/block-library/theme.min.css" /> */}
        
        {/* Editor specific styles */}
        {/* <link rel="stylesheet" href="http://headlesswordpress.local/wp-includes/css/dist/block-editor/style.min.css" />
        <link rel="stylesheet" href="http://headlesswordpress.local/wp-includes/css/dist/components/style.min.css" /> */}
        
        {/* WordPress admin styles that affect blocks */}
        {/* <link rel="stylesheet" href="http://headlesswordpress.local/wp-includes/css/dashicons.min.css" /> */}


        {/* <link rel="stylesheet" href="http://headlesswordpress.local/wp-json/headless/v1/global-styles.css" /> */}
      </body>
    </html>
  );
}