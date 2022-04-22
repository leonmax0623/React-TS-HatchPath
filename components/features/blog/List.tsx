import cn from 'util/classnames'

import { BlogType } from 'types/blog'
import { CommonProps } from 'types/common'

import BlogCard from './Card'

type BlogListProps = CommonProps & {
  blogs: BlogType[]
}
const BlogList = ({ id, className, blogs }: BlogListProps) => {
  return (
    <ul id={id} className={cn('grid grid-cols-12 gap-8 mt-4', className)}>
      {blogs.map((blog, idx) => (
        <li className="col-span-12 md:col-span-4" key={idx}>
          <BlogCard blog={blog} />
        </li>
      ))}
    </ul>
  )
}
export default BlogList
