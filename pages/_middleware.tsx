import { NextRequest, NextResponse } from 'next/server'

import { isAdmin } from 'util/env'

export const middleware = (request: NextRequest) => {
  if (isAdmin) {
    if (!request.page.name || request.page.name === '/') {
      return NextResponse.rewrite('/admin')
    } else if (!request.page.name?.startsWith('/admin')) {
      return NextResponse.rewrite('/404')
    } else {
      return NextResponse.next()
    }
    return NextResponse.next()
  } else {
    if (request.page.name?.startsWith('/admin')) {
      return NextResponse.rewrite('/404')
    } else {
      return NextResponse.next()
    }
  }
}
