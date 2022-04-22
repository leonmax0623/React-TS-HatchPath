import type { NextPage } from 'next'
import Image from 'next/image'

import Logo from 'components/common/Logo'

import { APP_NAME } from 'util/constants'

import Timeline from 'components/features/landing/Timeline'
import WaitlistForm from 'components/forms/Waitlist'
import PageLayout from 'components/layouts/Page'

const Home: NextPage = () => {
  return (
    <PageLayout
      isPagePublic={true}
      isHeaderHidden={true}
      className="bg-hatch-comfort"
      contentClassName="py-0"
    >
      <section className="grid grid-cols-12">
        <div className="flex flex-col col-span-12 items-start py-6 px-8 md:col-span-7">
          <Logo />
          <h1 className="mt-16 font-title text-5xl font-normal">
            A new way to reach your health goals
          </h1>
          <p className="mt-14 font-content text-xl tracking-wide uppercase">
            Find your ideal virtual health coach from the comfort of your own
            home
          </p>
          <p className="mt-auto mb-10 font-title text-xl">
            Apply to be a health coach on {APP_NAME} to increase your discovery
            and start earning income now
          </p>
        </div>
        <div className="col-span-12 md:col-span-5">
          <div className="relative w-full h-180">
            <Image
              src="/landing/person.jpg"
              alt="Coach illustration"
              loading="eager"
              priority={true}
              layout="fill"
              objectFit="cover"
            />
            <div className="flex absolute top-0 left-0 z-10 flex-col justify-center items-center w-full h-full bg-gray-700/60">
              <h1 className="text-white">Join our waitlist now</h1>
              <WaitlistForm className="mt-8" />
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col justify-center items-center py-16 px-8 bg-hatch-blue">
        <h1 className="mb-10 font-title text-5xl font-normal text-center text-white">
          Take the best path forward
        </h1>
        <Timeline />
      </section>
      <section className="grid grid-cols-12">
        <div className="relative col-span-12 h-180 md:col-span-4">
          <Image
            src="/landing/woman_on_phone.jpeg"
            alt="Woman on phone"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="flex relative flex-col col-span-12 items-center md:col-span-8">
          <h1 className="mt-16 font-title text-5xl font-normal">
            Bring your coach everywhere
          </h1>
          <div className="relative mt-auto w-full h-2/3">
            <Image
              src="/landing/zigzag.svg"
              alt="zigzag"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

export default Home
