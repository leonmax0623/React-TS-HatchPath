import PageLayout from 'components/layouts/Page'

const UnsupportedCountry = () => {
  return (
    <PageLayout
      title="Component palette"
      contentClassName="grid grid-cols-12 gap-4 w-full h-full pt-0 px-0"
      isPagePublic={true}
    >
      <main className="overflow-auto col-span-9 py-5 px-10 max-h-full text-center">
        <h1 className="mb-10">Sorry your country is unsupported</h1>
      </main>
    </PageLayout>
  )
}
export default UnsupportedCountry
