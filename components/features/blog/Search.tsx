import Loader from 'components/common/Loader'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

import { blogsApi } from 'services/blog'

import BlogList from './List'

type BlogSearchProps = CommonProps & {
  search: string
}
const BlogSearch = ({ id, className, search }: BlogSearchProps) => {
  const { data: blogs, isLoading } = blogsApi.useSearchBlogsQuery(search)

  return (
    <div id={id} className={cn('flex flex-col gap-y-2', className)}>
      {isLoading && <Loader className="mx-auto" />}
      {blogs?.length ? (
        <BlogList blogs={blogs} />
      ) : (
        <p className="text-lg">No blogs match your search</p>
      )}
    </div>
  )
}
export default BlogSearch
