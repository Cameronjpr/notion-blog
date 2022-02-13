import Head from 'next/head'
const { Client } = require('@notionhq/client')

export default function Home({ entries }: { entries: any }) {
  const notion = new Client({ auth: process.env.NOTION_API_KEY })

  console.log(entries)
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">Cameron's Blog</h1>

        {entries.map((entry: any) => (
          <div
            key={entry.id}
            className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full"
          >
            <a
              href="https://nextjs.org/docs"
              className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
            >
              <h2 className="text-2xl font-bold">
                {entry.properties.Name.title[0].plain_text} &rarr;
              </h2>
              <p className="mt-4 text-xl">
                {entry.properties.Author.rich_text[0].plain_text}
              </p>
            </a>
          </div>
        ))}
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
      entries: response.results,
    },
    revalidate: 1,
  }
}
