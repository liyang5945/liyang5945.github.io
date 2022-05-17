
type Props = {
  title: string
  date: string
}

const PostHeader = ({ title, date }: Props) => {
  return (
    <>
      <h1 className="text-xl md:text-2xl lg:text-2xl font-bold tracking-tighter leading-tight md:leading-none mb-6 text-center md:text-left">
        {title}
      </h1>
    </>
  )
}

export default PostHeader
