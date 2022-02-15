import { Fragment } from 'react'
import { getDatabase, getPage, getBlocks } from '../lib/notion'
import { getInnerText } from 'src/components/Text'
import Image from 'next/image'
import Link from 'next/link'

const NotionPageToHtml = require('notion-page-to-html')

const renderBlock = (block: any) => {
  const { type, id } = block
  const value = block[type]

  console.log(value.text)
  console.log(getInnerText(value.text))

  switch (type) {
    case 'paragraph':
      return <p>{getInnerText(value.text)}</p>
    case 'heading_1':
      return <h1>{getInnerText(value.text)}</h1>
    case 'heading_2':
      return <h2>{getInnerText(value.text)}</h2>
    case 'heading_3':
      return <h3>{getInnerText(value.text)}</h3>
    case 'bulleted_list_item':
    case 'numbered_list_item':
      return <li>{getInnerText(value.text)}</li>
    case 'child_page':
      return <p>{value.title}</p>
    case 'image':
      const src =
        value.type === 'external' ? value.external.url : value.file.url
      const caption = value?.caption ? value.caption[0]?.plain_text : ''
      return (
        <figure
          style={{ position: 'relative', width: '20rem', height: '15rem' }}
        >
          <Image src={src} alt={caption} layout="fill" />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      )
    default:
      return ``
  }
}

export default function Post({ page, blocks }: { page: any; blocks: any }) {
  console.log(page, blocks)
  if (!page || !blocks) {
    return <div />
  }
  return (
    <>
      <header className="flex justify-center">
        <Link href={`/`}>Home</Link>
      </header>
      <article className="mx-5 flex min-h-screen flex-col justify-center pt-5">
        <h1>{getInnerText(page.properties.Name.title)}</h1>
        <section>
          {blocks.map((block: any) => (
            <Fragment key={block.id}>{renderBlock(block)}</Fragment>
          ))}
        </section>
      </article>
    </>
  )
}

export const getStaticPaths = async () => {
  const database = await getDatabase(process.env.NOTION_DATABASE_ID)
  return {
    paths: database.map((page) => ({ params: { id: page.id } })),
    fallback: true,
  }
}

export const getStaticProps = async (context: any) => {
  const { id } = context.params
  const page = await getPage(id)
  const blocks = await getBlocks(id)

  // Retrieve block children for nested blocks (one level deep), for example toggle blocks
  // https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
  const childBlocks = await Promise.all(
    blocks
      .filter((block) => block.has_children)
      .map(async (block) => {
        return {
          id: block.id,
          children: await getBlocks(block.id),
        }
      })
  )
  const blocksWithChildren = blocks.map((block) => {
    // Add child blocks if the block should contain children but none exists
    if (block.has_children && !block[block.type].children) {
      block[block.type]['children'] = childBlocks.find(
        (x) => x.id === block.id
      )?.children
    }
    return block
  })

  return {
    props: {
      page,
      blocks: blocksWithChildren,
    },
    revalidate: 1,
  }
}
