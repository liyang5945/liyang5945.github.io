type Props = {
  content: string
}

const PostBody = ({ content }: Props) => {
  return (
    <div className="mx-auto">
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <p className="date-info pt-8 font-bold leading-10 text-center hidden">本文发布于天前，文中所描述的信息可能已发生改变</p>
    </div>
  )
}

export default PostBody
