import { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'

import dayjs from 'dayjs'

import Button from 'components/common/Button'
import Markdown from 'components/common/Markdown'

import { useAppSelector } from 'util/store'

import { BlogType } from 'types/blog'
import { ProfileType } from 'types/profile'

import ProfileOverview from 'components/features/profile/Overview'
import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'
import SectionLayout from 'components/layouts/Section'
import { getBlogById } from 'services/blog'
import { getProfileById } from 'services/profiles'

type BlogPageProps = {
  blog: BlogType | null
  author: ProfileType | null
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const data: BlogPageProps = {
    blog: null,
    author: null,
  }
  if (context.query.blogId) {
    const blog = await getBlogById(context.query.blogId as string)
    if (blog) {
      data.blog = blog
      const owner = await getProfileById(blog.author)
      data.author = owner || null
    }
  }

  return {
    props: data,
  }
}
const BlogPage: NextPage<BlogPageProps> = ({ blog, author }) => {
  const { profile } = useAppSelector((state) => state.profile)
  return (
    <PageLayout title={blog?.title} notFound={!blog}>
      {blog?.banner?.url && (
        <div className="relative w-full h-80 bg-gray-100 rounded">
          <Image
            src={blog?.banner?.url}
            alt="blog banner"
            layout="fill"
            objectFit="contain"
          />
        </div>
      )}
      <div className="flex flex-row justify-between items-center my-2">
        <div>
          <h1>{blog?.title}</h1>
          <div className="flex flex-row items-center">
            <Button
              variant="link"
              color="secondary"
              href={`/profile/${author?.id}`}
            >
              {author?.coach?.businessName ||
                `${author?.firstName} ${author?.lastName}`}
            </Button>
            <p className="pl-2 ml-2 border-l border-gray-200">
              {dayjs(blog?.createdTime).format('MMM DD, YYYY')}
            </p>
          </div>
        </div>
        {profile?.id === author?.id && profile && author && (
          <Button href={`/blog/${blog?.id}/edit`}>Manage blog</Button>
        )}
      </div>

      <Markdown className="my-4" value={blog?.content} />
      {author && (
        <SectionLayout
          className="pt-4 mt-4 border-t border-gray-200"
          title="About the author"
        >
          <ProfileOverview profile={author} type="coach" />
        </SectionLayout>
      )}
    </PageLayout>
  )
}
export default withAuth(BlogPage, { checkUser: false, checkProfile: false })
