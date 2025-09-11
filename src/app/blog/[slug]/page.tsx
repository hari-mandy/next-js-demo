'use client'

import React from 'react'
import { useQuery } from '@apollo/client'
import { GET_POST_BY_SLUG } from '../../../queries/get-post-by-slug'

// Props passed from Next.js dynamic route
interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

// Shape of GraphQL data (adjust based on your actual query)
interface PostDetailData {
  post: {
    id: string
    title: string
    content: string
    slug: string
  }
}

const PostDetailPage = ({ params }: PostPageProps) => {
  const resolvedParams = React.use(params)
  const { slug } = resolvedParams
  
  const { data, loading, error } = useQuery<PostDetailData>(GET_POST_BY_SLUG, {
    variables: { slug },
  })

  if (loading) return <p>Loading post...</p>
  if (error) return <p>Error loading post: {error.message}</p>
  if (!data?.post) return <p>Post not found</p>

  const { post } = data

  return (
    <div style={{ padding: '2rem' }}>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  )
}

export default PostDetailPage
