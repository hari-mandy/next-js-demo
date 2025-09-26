'use client';

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function HomePage() {
  const { user, logout } = useAuth();
  return (
    <div>
      {/* Header with Login link */}
      <header className="flex justify-end p-4 md:p-6 border-b border-gray-200">
        {user ? (
          <button
            onClick={logout}
            className="text-red-600 font-bold text-base hover:underline"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="text-blue-600 font-bold text-base hover:underline"
          >
            Login
          </Link>
        )}
      </header>

      {/* Main Content */}
      <main className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to My Blog</h1>
        <p className="text-lg text-gray-600 mb-6">
          Built with Next.js and WordPress!
        </p>
        <Link
          href="/blog"
          className="text-blue-600 text-xl font-semibold hover:underline"
        >
          View Blog Posts →
        </Link>
      </main>
    </div>
  );
}
