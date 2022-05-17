export default function Paginator({paginatorInfo}) {
  const pageLength = paginatorInfo.total;
  let pageLinks = []
  for (let i = 1; i <= pageLength; i++) {
    let pagePath = i == 1 ? '/' : `/page/${i}`
    pageLinks.push(
      <a key={i}
         className={`inline-block px-3 py-1 m-3 paginator-link ${paginatorInfo.current == i && 'active'}`}
         href={pagePath}>{i}</a>
    )
  }
  return (
    <div className="page-paginator text-center">
      {pageLinks}
    </div>
  )
}

