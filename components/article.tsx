export default function Article(props) {
  function createHtml() {
    return {
      __html: props.excerpt
    }
  }

  return (
    <article className="article-block p-5 py-4 mb-8 rounded-sm clear-both">
      <h2 className="article-title text-2xl mb-2">
        <a href={`/article/${props.articlePath}`}>
          {props.title}
        </a>
      </h2>
      <div className="article-info text-sm mb-2">
        <span>{props.date}</span>
        <span className={"px-1.5"}>·</span>
        <span>{props.categories}</span>
      </div>
      <div className="text-sm leading-6" dangerouslySetInnerHTML={createHtml()}/>
      <div className="clear-both overflow-auto">
          <a href={`/article/${props.articlePath}`} className="read-all inline-block float-right text-blue-500">阅读全文</a>
      </div>
    </article>
  )
}
