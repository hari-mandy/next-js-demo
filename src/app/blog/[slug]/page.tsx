'use client'

import React from 'react'
import { useQuery } from '@apollo/client'
import { GET_POST_BY_SLUG } from '../../../queries/get-post-by-slug'

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

interface EnqueuedStyle {
  rel: string
  src: string | null
  id: string
  extra: string
}

interface PostDetailData {
  post: {
    id: string
    title: string
    content: string
    slug: string
    date: string
    enqueuedStylesheets: {
      nodes: EnqueuedStyle[]
    }
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
    <>
      {/* Render stylesheets */}
      {post.enqueuedStylesheets?.nodes?.map((style) => {
        if (!style.src) return null

        // ✅ Fix relative URLs
        const href = style.src.startsWith('http')
          ? style.src
          : `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}${style.src}`

        return (
          <link
            key={style.id || href}
            rel={style.rel}
            href={href}
            id={style.id}
          />
        )
      })}

      <div>
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </>
  )
}

export default PostDetailPage
