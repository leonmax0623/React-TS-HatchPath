import { NextPage } from 'next'
import { useState } from 'react'

import { useDebounce } from 'use-debounce'

import InputText from 'components/common/InputText'
import Tabs from 'components/common/Tabs'

import BlogList from 'components/features/blog/List'
import BlogSearch from 'components/features/blog/Search'
import JobList from 'components/features/job/List'
import JobSearch from 'components/features/job/Search'
import ProfileList from 'components/features/profile/List'
import ProfileSearch from 'components/features/profile/Search'
import ProgramList from 'components/features/program/List'
import ProgramSearch from 'components/features/program/Search'
import withAuth from 'components/hoc/withAuth'
import PageLayout from 'components/layouts/Page'
import SectionLayout from 'components/layouts/Section'
import { blogsApi } from 'services/blog'
import { jobsApi } from 'services/job'
import { profilesApi } from 'services/profiles'
import { programsApi } from 'services/program'

const SearchPage: NextPage = () => {
  const [search, setSearch] = useState<string>('')
  const [searchValue] = useDebounce(search, 1000)

  const [tab, setTab] = useState<number>(0)

  const { data: jobs } = jobsApi.useGetRecentJobsQuery()
  const { data: blogs } = blogsApi.useGetRecentBlogsQuery()
  const { data: coaches } = profilesApi.useGetRecentCoachesQuery()
  const { data: programs } = programsApi.useGetRecentProgramsQuery()

  return (
    <PageLayout title="Search">
      <h1>Find your path</h1>
      <InputText
        className="my-4"
        leftIcon={{ icon: 'search' }}
        placeholder="What are you looking for?"
        value={search}
        onValueChange={setSearch}
      />
      {searchValue ? (
        <>
          <Tabs
            className="my-4"
            items={['Blogs', 'Jobs', 'Programs', 'Coaches']}
            value={tab}
            onValueChange={setTab}
          />
          {tab === 0 ? (
            <BlogSearch search={searchValue} />
          ) : tab === 1 ? (
            <JobSearch search={searchValue} />
          ) : tab === 2 ? (
            <ProgramSearch search={searchValue} />
          ) : (
            <ProfileSearch search={searchValue} />
          )}
        </>
      ) : (
        <div className="flex flex-col gap-y-10 mt-10">
          {jobs && jobs.length > 0 && (
            <SectionLayout titleClassName="font-normal" title="Latest jobs">
              <JobList jobs={jobs} />
            </SectionLayout>
          )}
          {blogs && blogs.length > 0 && (
            <SectionLayout
              titleClassName="font-normal"
              title="What coaches are talking about"
            >
              <BlogList blogs={blogs} />
            </SectionLayout>
          )}
          {programs && programs.length > 0 && (
            <SectionLayout titleClassName="font-normal" title="Latest programs">
              <ProgramList programs={programs} />
            </SectionLayout>
          )}
          {coaches && coaches.length > 0 && (
            <SectionLayout
              titleClassName="font-normal"
              title="Newcomer coaches"
            >
              <ProfileList profiles={coaches} />
            </SectionLayout>
          )}
        </div>
      )}
    </PageLayout>
  )
}
export default withAuth(SearchPage, { checkUser: false, checkProfile: false })
