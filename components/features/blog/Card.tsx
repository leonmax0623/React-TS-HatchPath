import Image from 'next/image'
import Link from 'next/link'

import Icon from 'components/common/Icon'

import cn from 'util/classnames'

import { BlogType } from 'types/blog'
import { CommonProps } from 'types/common'

type BlogCardProps = CommonProps & {
  blog: BlogType
}
const BlogCard = ({ id, className, blog }: BlogCardProps) => {
  return (
    <div id={id} className={cn('rounded cursor-pointer', className)}>
      <Link href={`/blog/${blog.id}`} passHref={true}>
        <a className="flex flex-col w-full h-full">
          <div className="flex relative flex-col justify-center items-center w-full h-50 bg-gray-500 rounded">
            {blog.banner && blog.banner.url ? (
              <Image
                src={blog.banner.url}
                alt="blog banner"
                layout="fill"
                objectFit="contain"
              />
            ) : (
              <Icon icon="image-slash" className="!w-10 !h-10 text-white" />
            )}
          </div>
          <h3>
            {blog.title}{' '}
            {!blog.isPublished && (
              <span className="text-sm font-light">(unpublished)</span>
            )}
          </h3>
        </a>
      </Link>
    </div>
  )
}
export default BlogCard
