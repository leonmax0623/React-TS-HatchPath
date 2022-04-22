import dayjs from 'dayjs'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'

import { Firestore, Storage } from 'util/fire'
import { getBlogIndex } from 'util/search'
import uuid from 'util/uuid'

import { BlogType } from 'types/blog'
import { FileType } from 'types/file'

import { mainApi } from './main'

export const BLOG_COLLECTION = 'blogs'

export const getBlogById = async (blogId: string) => {
  const docRef = doc(Firestore, BLOG_COLLECTION, blogId)
  const document = await getDoc(docRef)
  if (document.exists()) {
    const blog = document.data() as BlogType
    return blog
  } else {
    return undefined
  }
}

export const blogsApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlog: builder.query<BlogType | undefined, string>({
      queryFn: async (blogId) => {
        const blog = await getBlogById(blogId)
        return {
          data: blog,
        }
      },
      providesTags: (result) =>
        result ? [{ type: 'Blogs', id: result.id }] : [],
    }),
    getBlogsByAuthor: builder.query<BlogType[], string>({
      queryFn: async (authorId) => {
        const collectionRef = collection(Firestore, BLOG_COLLECTION)
        const q = query(
          collectionRef,
          where('author', '==', authorId),
          limit(1000),
        )
        const docs = await getDocs(q)

        const blogs: BlogType[] = []
        docs.forEach((doc) => blogs.push(doc.data() as BlogType))
        return {
          data: blogs,
        }
      },
      providesTags: (result) => {
        const tags: { type: 'Blogs'; id: string }[] = [
          { type: 'Blogs', id: 'LIST' },
        ]
        if (result) {
          result.forEach(({ id }) => {
            tags.push({
              type: 'Blogs',
              id,
            })
          })
        }
        return tags
      },
    }),
    getRecentBlogs: builder.query<BlogType[], void>({
      queryFn: async () => {
        const collectionRef = collection(Firestore, BLOG_COLLECTION)
        const q = query(
          collectionRef,
          where('isPublished', '==', true),
          orderBy('createdTime', 'desc'),
          limit(3),
        )
        const docs = await getDocs(q)
        const blogs: BlogType[] = []
        docs.forEach((doc) => {
          if (doc.exists()) {
            const b = doc.data() as BlogType
            blogs.push(b)
          }
        })
        return {
          data: blogs,
        }
      },
      providesTags: (result) => {
        const tags: { type: 'Blogs'; id: string }[] = [
          { type: 'Blogs', id: 'LIST' },
        ]
        if (result) {
          result.forEach(({ id }) => {
            tags.push({
              type: 'Blogs',
              id,
            })
          })
        }
        return tags
      },
    }),
    getRecommendedBlogs: builder.query<BlogType[], string[]>({
      queryFn: async (tags) => {
        const blogsRef = collection(Firestore, BLOG_COLLECTION)

        const q = query(
          blogsRef,
          where('isPublished', '==', true),
          where(
            'searchIndex',
            'array-contains-any',
            tags.slice(0, Math.min(tags.length, 10)),
          ),
          orderBy('createdTime', 'desc'),
          limit(3),
        )
        const docs = await getDocs(q)
        const blogs: BlogType[] = []
        docs.forEach((doc) => {
          const blog = doc.data() as BlogType
          blogs.push(blog)
        })

        return {
          data: blogs,
        }
      },
      providesTags: (result) => {
        const tags: { type: 'Blogs'; id: string }[] = [
          { type: 'Blogs', id: 'LIST' },
        ]
        if (result) {
          result.forEach(({ id }) => {
            tags.push({
              type: 'Blogs',
              id,
            })
          })
        }
        return tags
      },
    }),
    searchBlogs: builder.query<BlogType[], string>({
      queryFn: async (search) => {
        const blogsRef = collection(Firestore, BLOG_COLLECTION)

        const searchArray = search.trim().toLocaleLowerCase().split(' ')
        const q = query(
          blogsRef,
          where('isPublished', '==', true),
          where(
            'searchIndex',
            'array-contains-any',
            searchArray.slice(0, Math.min(searchArray.length, 10)),
          ),
          orderBy('createdTime', 'desc'),
          limit(100),
        )
        const docs = await getDocs(q)
        const programs: BlogType[] = []
        docs.forEach((doc) => {
          const program = doc.data() as BlogType
          programs.push(program)
        })

        return {
          data: programs,
        }
      },
      providesTags: (result) => {
        const tags: { type: 'Blogs'; id: string }[] = [
          { type: 'Blogs', id: 'LIST' },
        ]
        if (result) {
          result.forEach(({ id }) => {
            tags.push({
              type: 'Blogs',
              id,
            })
          })
        }
        return tags
      },
    }),
    createBlog: builder.mutation<
      BlogType,
      {
        author: string
        banner: FileType | null
        title: string
        tags: string[]
        content: string
        isPublished: boolean
      }
    >({
      queryFn: async ({
        author,
        banner,
        title,
        tags,
        content,
        isPublished,
      }) => {
        const lowerTags: string[] = tags.map((tag) =>
          tag.trim().toLocaleLowerCase(),
        )

        const blog: BlogType = {
          id: uuid(),
          createdTime: dayjs().valueOf(),
          author,
          searchIndex: getBlogIndex(title, lowerTags),
          title,
          banner: null,
          tags: lowerTags,
          content,
          isPublished,
        }

        const nextBanner: FileType | null = banner
          ? {
              ...banner,
            }
          : null
        if (nextBanner && nextBanner.data) {
          const nextFilePath = `blogs/${author}/${blog.id}/${nextBanner.id}`
          const nextRef = ref(Storage, nextFilePath)
          await uploadBytes(nextRef, nextBanner.data, {
            contentType: nextBanner.format,
          })
          const url = await getDownloadURL(nextRef)
          nextBanner.url = url
          nextBanner.data = null
          blog.banner = nextBanner
        }

        const docRef = doc(Firestore, BLOG_COLLECTION, blog.id)
        await setDoc(docRef, blog)

        return {
          data: blog,
        }
      },
      invalidatesTags: (result) => {
        const tags: { type: 'Blogs'; id: string }[] = [
          { type: 'Blogs', id: 'LIST' },
        ]
        if (result) {
          tags.push({ type: 'Blogs', id: result.id })
        }
        return tags
      },
    }),
    updateBlog: builder.mutation<
      string,
      {
        current: BlogType
        next: Partial<BlogType>
      }
    >({
      queryFn: async ({ current, next }) => {
        const nextBlog: BlogType = {
          ...current,
          ...next,
          id: current.id,
        }
        nextBlog.searchIndex = getBlogIndex(nextBlog.title, nextBlog.tags)

        const currBanner = current.banner
        const nextBanner = next.banner
        if (
          nextBanner &&
          (!currBanner || nextBanner.id !== currBanner?.id) &&
          !!nextBanner.data
        ) {
          if (currBanner) {
            const currFilePath = `blogs/${current.author}/${current.id}/${currBanner.id}`
            const currRef = ref(Storage, currFilePath)
            await deleteObject(currRef)
          }

          const nextFilePath = `blogs/${current.author}/${current.id}/${nextBanner.id}`
          const nextRef = ref(Storage, nextFilePath)
          await uploadBytes(nextRef, nextBanner.data, {
            contentType: nextBanner.format,
          })
          const url = await getDownloadURL(nextRef)
          nextBanner.url = url
          nextBanner.data = null
          nextBlog.banner = nextBanner
        } else if (currBanner && !nextBanner) {
          const currFilePath = `blogs/${current.author}/${current.id}/${currBanner.id}`
          const currRef = ref(Storage, currFilePath)
          await deleteObject(currRef)
          nextBlog.banner = null
        }

        const docRef = doc(Firestore, BLOG_COLLECTION, current.id)
        await updateDoc(docRef, nextBlog)
        return {
          data: current.id,
        }
      },
      invalidatesTags: (result) => {
        const tags: { type: 'Blogs'; id: string }[] = [
          { type: 'Blogs', id: 'LIST' },
        ]
        if (result) {
          tags.push({ type: 'Blogs', id: result })
        }
        return tags
      },
    }),
    removeBlog: builder.mutation<string, string>({
      queryFn: async (blogId) => {
        const ref = doc(Firestore, BLOG_COLLECTION, blogId)
        await deleteDoc(ref)

        return {
          data: blogId,
        }
      },
      invalidatesTags: (result) => [
        { type: 'Blogs', id: 'LIST' },
        { type: 'Blogs', id: result },
      ],
    }),
  }),
})
