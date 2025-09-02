'use client';
import { useQuery } from '@apollo/client';
import { GET_POSTS } from '../lib/queries';
import { PostsData } from '../types/post';

export default function PostList() {
  // Fetch posts from WordPress
  const { data, loading, error } = useQuery<PostsData>(GET_POSTS);

  // Show loading message
  if (loading) return <p>Loading posts...</p>;
  
  // Show error if something went wrong
  if (error) return <p>Error: {error.message}</p>;
  
  // Show the posts
  return (
    <div>
      <h1>Blog Posts</h1>
      {data?.posts.nodes.map((post) => (
        <div 
          key={post.id} 
          style={{ 
            marginBottom: '2rem', 
            padding: '1rem', 
            border: '1px solid #ddd',
            borderRadius: '8px'
          }}
        >
          <h2>{post.title}</h2>
          
          {/* Show featured image if it exists */}
          {post.featuredImage && (
            <img 
              src={post.featuredImage.node.sourceUrl} 
              alt={post.featuredImage.node.altText}
              style={{ 
                maxWidth: '100%', 
                height: 'auto',
                marginBottom: '1rem'
              }}
            />
          )}
          
          {/* Show excerpt (preview text) */}
          <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
          
          {/* Show author and date */}
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            <strong>By:</strong> {post.author.node.name} | 
            <strong> Date:</strong> {new Date(post.date).toLocaleDateString()}
          </p>
          
          {/* Link to full post */}
          <a 
            href={`/blog/${post.slug}`}
            style={{ 
              color: '#0070f3',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Read More →
          </a>
        </div>
      ))}
    </div>
  );
}