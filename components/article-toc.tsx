const ArticleToc = ({toc}) => {
  return (
    <div className="w-1/4 pl-3 rounded">
      <div className="article-toc p-4 sticky top-10">
        <h3 className="toc-title">文章目录</h3>
        <div dangerouslySetInnerHTML={{__html: toc}}/>
      </div>
    </div>
  )
}
export default ArticleToc
