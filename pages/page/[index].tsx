import {PageConfig} from 'next';
import Article from '@/components/article'

import {
  buildIndexPagination,
  getArticlesByIndex,
  getPagePaginatorByIndex,
} from "@/lib/api";
import Layout from "@/components/layout";
import Head from "next/head";
import {BLOG_NAME} from "@/lib/constants";
import Container from "@/components/container";
import Paginator from "@/components/paginator";


export const getStaticPaths = async () => {
  const paths = await  buildIndexPagination()

  let filterPaths = paths.filter(item=>item.path!='')

  let result = filterPaths.map((item, index) => {
    return {
      params: {
        index: item.data.current.toString(),
      },
    }
  })
  return {
    paths: result,
    fallback: false,
  };
};

export async function getStaticProps({params}) {

  const articleList = await getArticlesByIndex(params.index)
  const paginatorInfo = await getPagePaginatorByIndex(params.index)

  return {
    props: {
      pageIndex:params.index,
      articleList,
      paginatorInfo,
    },
  }
}

export const config: PageConfig = {
  unstable_runtimeJS: false
};
export default function IndexPage({articleList,paginatorInfo}) {
  return (
      <Layout>
        <Head>
          <title>{`第${paginatorInfo.current}页 | ${BLOG_NAME}`}</title>
        </Head>
        <Container>
          <div className="article-list px-3">
            {
              articleList.map((article) => (
                <Article {...article} key={article.articlePath}/>
              ))
            }
          </div>
          <Paginator paginatorInfo={paginatorInfo}/>
        </Container>
      </Layout>
  )
}

