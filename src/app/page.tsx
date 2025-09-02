// src/app/page.tsx (Home page)


export default function HomePage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to My Blog</h1>
      <p>Built with Next.js and WordPress!</p>
      <a 
        href="/blog"
        style={{ 
          color: '#0070f3', 
          textDecoration: 'none', 
          fontSize: '1.2rem',
          fontWeight: 'bold'
        }}
      >
        View Blog Posts →
      </a>
    </div>
  );
}