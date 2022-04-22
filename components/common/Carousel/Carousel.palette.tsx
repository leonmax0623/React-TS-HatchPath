import { range } from 'util/list'

import Carousel from '.'

const ITEMS = range(0, 4).map((i) => ({
  content: (
    <div className="flex flex-row justify-center items-center">
      <p className="p-4 h-20 rounded border border-gray-400 shadow">
        Carouse item {i}
      </p>
    </div>
  ),
}))
const CarouselPalette = () => {
  return (
    <div className="flex flex-col">
      <Carousel items={ITEMS} />
    </div>
  )
}
export default CarouselPalette
