import {
  getAllPosts,
  fetchAllCategory,
  fetchAllTags,
} from "@/lib/api";
import Layout from "@/components/layout";
import Head from "next/head";
import {BLOG_NAME} from "@/lib/constants";
import Container from "@/components/container";
import {PageConfig} from "next";

export async function getStaticProps() {

  const articleList = await getAllPosts()
  const categoryList = await fetchAllCategory()
  const tagList = await fetchAllTags()

  return {
    props: {
      articleList,
      categoryList,
      tagList,
    },
  }
}

export const config: PageConfig = {
  unstable_runtimeJS: false
};

function articleList({articleList, categoryList, tagList}) {
  // 按年份分类全部文章
  const yearList = []
  let articleLength = articleList.length;
  for (let i = 0; i < articleLength; i++) {
    let articleItem = articleList[i]
    let flag = 0;
    let k = 0;
    yearList.forEach((newItem, j) => {
      if (yearList[j].year === articleItem.year) {
        flag = 1;
        k = j;
      }
    });
    if (flag) {
      yearList[k].children.push(articleItem)
    } else {
      let temp = {
        year: articleItem.year,
        children: []
      }
      temp.children.push(articleItem);
      yearList.push(temp);
    }
  }

  return (
    <>
      <Layout>
        <Head>
          <title>{`归档 | ${BLOG_NAME}`}</title>
        </Head>
        <Container>
          <main className="flex">
            <div id="archive-wrapper" className={"w-full md:w-2/3 p-3 rounded-sm pl-5 archives-content"}>
              {
                yearList.map(yearItem => (
                  <div key={yearItem.year} className={"year-item my-3"}>
                    <h4 className={"text-2xl"}>{yearItem.year}</h4>
                    <div className={"article-link-wrapper mt-3 border-l border-gray-300"}>
                      {
                        yearItem.children.map((article) => (
                          <div
                            key={article.articlePath}
                            className={"py-2 pl-3 relative -left-px  border-l-2 border-transparent hover:border-green-500 "}>
                            <span className={"mr-3 text-sm text-gray-500"}>{article.date}</span>
                            <a href={"/article/" + article.articlePath}>{article.title}</a>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                ))
              }

            </div>
            <div className={"hidden md:block md:w-1/3 pl-5"}>
              <div className="tag-card mb-5 rounded-sm p-4 shadow  max-w-screen-lg">
                <h3 className='text-center text-2xl leading-normal pb-3 mb-5 border-b'>分类</h3>
                {
                  categoryList.map((categoryItem) => {
                    return (
                      <div
                        key={categoryItem.id}
                        data-category={categoryItem.name}
                        className={`category-item leading-6 px-5 py-1 rounded-sm my-1 clear-both`}
                      >
                        {categoryItem.name}
                        <span className={"inline-block border rounded-sm float-right px-2"}>{categoryItem.length}</span>
                      </div>
                    )
                  })
                }
              </div>
              <div className="tag-card mb-5 rounded-sm p-4 shadow  max-w-screen-lg">
                <h3 className='text-center text-2xl leading-normal pb-3 mb-5 border-b'>标签</h3>
                {
                  tagList.map((tagItem) => {
                    return (
                      <div
                        key={tagItem.id}
                        data-tag={tagItem.name}
                        className={
                          `tag-item inline-block text-center leading-7 px-2 rounded-sm my-1`
                        }
                      >{`${tagItem.name}(${tagItem.length})`}</div>
                    )
                  })
                }
              </div>
            </div>
          </main>
        </Container>
      </Layout>
    </>
  )
}

export default articleList
