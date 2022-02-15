import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = "Cameron's Blog" }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header className="flex justify-center pt-5">
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>
      </nav>
    </header>
    <div className="pt-5">{children}</div>
  </div>
)

export default Layout
