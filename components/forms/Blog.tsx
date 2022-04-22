import { Field, FieldProps, Form, Formik } from 'formik'

import Button from 'components/common/Button'
import InputImage from 'components/common/InputImage'
import InputMarkdown from 'components/common/InputMarkdown'
import InputTags from 'components/common/InputTags'
import InputText from 'components/common/InputText'
import Switch from 'components/common/Switch'
import { useToast } from 'components/common/Toast'

import cn from 'util/classnames'
import { TAGS_LIST } from 'util/constants'
import { useAppSelector } from 'util/store'
import Yup from 'util/yup'

import { BlogType } from 'types/blog'
import { CommonProps } from 'types/common'

import { blogsApi } from 'services/blog'

type BlogFormProps = CommonProps & {
  blog?: BlogType
  onCreate?: (id: string) => void
  onUpdate?: (id: string) => void
  onRemove?: (id: string) => void
}
const BlogForm = ({
  id,
  className,
  blog,
  onCreate = () => undefined,
  onUpdate = () => undefined,
  onRemove = () => undefined,
}: BlogFormProps) => {
  const { toast, error } = useToast()
  const { user } = useAppSelector((state) => state.user)
  const [createBlog, { isLoading: creating }] = blogsApi.useCreateBlogMutation()
  const [updateBlog, { isLoading: updating }] = blogsApi.useUpdateBlogMutation()
  const [removeBlog, { isLoading: removing }] = blogsApi.useRemoveBlogMutation()

  const handleRemove = async () => {
    if (blog) {
      try {
        await removeBlog(blog.id).unwrap()
        toast({
          title: 'Blog deleted',
          description: 'Succesfully deleted this blog',
          type: 'success',
        })
        onRemove(blog.id)
      } catch {
        error()
      }
    }
  }

  return (
    <Formik
      initialValues={{
        title: blog?.title || '',
        tags: blog?.tags || [],
        banner: blog?.banner || null,
        content: blog?.content || '',
        isPublished: blog?.isPublished || false,
      }}
      validationSchema={Yup.object({
        title: Yup.string().max(10000).required(),
        tags: Yup.array(Yup.string().max(10000)),
        banner: Yup.object().nullable(),
        content: Yup.string().max(1000000).required(),
        isPublished: Yup.bool(),
      })}
      onSubmit={async ({ title, tags, banner, content, isPublished }) => {
        if (user) {
          try {
            if (blog) {
              await updateBlog({
                current: blog,
                next: {
                  title,
                  tags,
                  banner,
                  content,
                  isPublished,
                },
              }).unwrap()
              toast({
                title: 'Blog updated',
                description: 'Succesfully saved changes to this blog',
                type: 'success',
              })
              onUpdate(blog.id)
            } else {
              const created = await createBlog({
                author: user.id,
                title,
                tags,
                banner,
                content,
                isPublished,
              }).unwrap()
              toast({
                title: 'Blog created',
                description: 'Succesfully created this blog',
                type: 'success',
              })
              onCreate(created.id)
            }
          } catch {
            error()
          }
        }
      }}
    >
      {({ errors, touched }) => (
        <Form id={id} className={cn('flex flex-col gap-y-8', className)}>
          <Field name="banner">
            {({ field }: FieldProps) => (
              <InputImage
                {...field}
                label="Banner image for your blog"
                className="text-center"
                labelClassName="!text-center"
              />
            )}
          </Field>
          <Field name="title">
            {({ field }: FieldProps) => (
              <InputText
                {...field}
                label="Title"
                error={touched.title ? errors.title : ''}
              />
            )}
          </Field>
          <Field name="tags">
            {({ field }: FieldProps) => (
              <InputTags
                {...field}
                label="Tags"
                error={
                  touched.tags && typeof errors.tags === 'string'
                    ? errors.tags
                    : ''
                }
                options={TAGS_LIST}
                lowerCase={true}
              />
            )}
          </Field>
          <Field name="content">
            {({ field }: FieldProps) => (
              <InputMarkdown
                {...field}
                label="Content"
                error={
                  touched.content && typeof errors.content === 'string'
                    ? errors.content
                    : ''
                }
                helper="This editor supports Markdown syntax"
              />
            )}
          </Field>
          <Field name="isPublished">
            {({ field }: FieldProps) => (
              <Switch
                {...field}
                label="Published"
                error={
                  touched.isPublished && typeof errors.isPublished === 'string'
                    ? errors.isPublished
                    : ''
                }
              />
            )}
          </Field>
          <div className="flex flex-row gap-x-2 justify-center">
            {blog && (
              <Button
                leftIcon={{ icon: 'trash' }}
                loading={removing}
                color="error"
                onClick={handleRemove}
              >
                Delete blog
              </Button>
            )}
            <Button loading={creating || updating} type="submit">
              Save blog
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
export default BlogForm
