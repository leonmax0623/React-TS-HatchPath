import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import BlogForm from 'components/forms/Blog'
import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'
import { blogsApi } from 'services/blog'

const EditBlogPage: NextPage = () => {
  const router = useRouter()
  const {
    data: blog,
    isLoading,
    isError,
  } = blogsApi.useGetBlogQuery(router.query.blogId as string)

  return (
    <PageLayout
      title={blog?.title}
      loading={isLoading}
      error={isError}
      notFound={!blog}
    >
      <h1 className="mb-2">Edit blog</h1>
      <BlogForm
        blog={blog}
        onUpdate={(id) => router.push(`/blog/${id}`)}
        onRemove={() => router.push('/coach/home')}
      />
    </PageLayout>
  )
}
export default withAuth(EditBlogPage, { profileType: 'coach' })
