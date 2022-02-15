import styles from './text.module.css'

export const getInnerText = (text: any) => {
  if (!text) {
    return null
  }
  return text.map((value: any) => {
    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text,
    } = value

    if (bold) return <strong>{text.content}</strong>
    if (italic) return <em>{text.content}</em>
    if (code) return <code>{text.content}</code>
    if (text.link) return <a href={text.link.url}>{text.content}</a>

    return text.content
  })
}
