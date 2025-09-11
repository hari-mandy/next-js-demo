'use client';
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apollo';
import { CartProvider } from 'use-shopping-cart';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif' }}>
        <ApolloProvider client={client}>
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
            </CartProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}