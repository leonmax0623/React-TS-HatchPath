import Loader from '.'

const LoaderPalette = () => {
  return (
    <div className="flex flex-col space-y-4">
      <Loader />
      <Loader type="text" />
    </div>
  )
}
export default LoaderPalette
