import { NextPage } from 'next'
import { useRouter } from 'next/router'

import BlogForm from 'components/forms/Blog'
import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'

const CreateBlogPage: NextPage = () => {
  const router = useRouter()
  return (
    <PageLayout title="New blog">
      <h1 className="mb-2">New blog</h1>
      <BlogForm onCreate={(id) => router.push(`/blog/${id}`)} />
    </PageLayout>
  )
}
export default withAuth(CreateBlogPage, { profileType: 'coach' })
