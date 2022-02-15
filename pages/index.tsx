import Head from 'next/head'
import Link from 'next/link'

const { Client } = require('@notionhq/client')

export default function Home({ posts }: { posts: any }) {
  console.log(posts)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">Cameron's Blog</h1>

        <ul>
          {posts.map((post: any) => (
            <li
              key={post.id}
              className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full"
            >
              <Link href={`/${post.id}`}>
                {post.properties.Name.title[0].plain_text}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  const notion = new Client({ auth: process.env.NOTION_API_KEY })
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  })

  return {
    props: {
      posts: response.results,
    },
    revalidate: 1,
  }
}
