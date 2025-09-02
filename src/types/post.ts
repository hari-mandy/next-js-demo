// Simple post type - this describes what a WordPress post looks like
export interface Post {
  id: string;           // Unique ID like "123"
  title: string;        // Post title like "My First Post"
  content: string;      // Full post content (HTML)
  excerpt: string;      // Short preview text
  slug: string;         // URL part like "my-first-post"
  date: string;         // When it was published
  author: {             // Who wrote it
    node: {
      name: string;     // Author name like "John Doe"
    };
  };
  featuredImage?: {     // Main image (optional - that's why ?)
    node: {
      sourceUrl: string;  // Image URL
      altText: string;    // Description for accessibility
    };
  };
}

// What we get when asking for multiple posts
export interface PostsData {
  posts: {
    nodes: Post[];      // Array of posts
  };
}

// What we get when asking for one specific post
export interface SinglePostData {
  post: Post;           // Just one post
}