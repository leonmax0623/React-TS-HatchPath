import { NextResponse } from 'next/server'

import { isDev } from 'util/env'

export const middleware = () => {
  return isDev ? NextResponse.next() : NextResponse.rewrite('/404')
}
