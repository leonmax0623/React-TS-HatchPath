/* eslint-disable import/no-unresolved */
import { ReactNode } from 'react'

import SwiperCore, { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

SwiperCore.use([Navigation, Pagination])

export type CarouselItemType = {
  className?: string
  content: ReactNode
}
type CarouselProps = Omit<CommonProps, 'id'> & {
  items: CarouselItemType[]
  showControls?: boolean
  showPages?: boolean
  slidesToShow?: number
  slidesToScroll?: number
}
const Carousel = ({
  className,
  items,
  showControls = true,
  showPages = true,
}: CarouselProps) => {
  return (
    <Swiper
      className={cn('w-full h-50', className)}
      navigation={showControls}
      pagination={showPages ? { clickable: true } : false}
    >
      {items.map(({ className, content }, idx) => (
        <SwiperSlide className={className} key={idx}>
          {content}
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
export default Carousel
