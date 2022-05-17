import {PageConfig} from 'next';
import Article from '@/components/article'

import {
  getArticlesByIndex,
  getPagePaginatorByIndex,
} from "@/lib/api";
import Layout from "@/components/layout";
import Head from "next/head";
import {BLOG_NAME} from "@/lib/constants";
import Container from "@/components/container";
import Paginator from "@/components/paginator";
import Meta from "@/components/meta";

export async function getStaticProps() {
  const articleList = await getArticlesByIndex(1)
  const paginatorInfo = await getPagePaginatorByIndex(1)
  return {
    props: {
      articleList,
      paginatorInfo
    },
  }
}

export const config: PageConfig = {
  unstable_runtimeJS: false
};
export default function IndexPage({articleList, paginatorInfo}) {

  return (
    <>
      <Layout>
        <Meta/>
        <Head>
          <title>{`首页 | ${BLOG_NAME}`}</title>
        </Head>
        <Container>
          <div className="article-list">
            {
              articleList.map((article) => (
                <Article {...article} key={article.articlePath}/>
              ))
            }
          </div>
          <Paginator paginatorInfo={paginatorInfo}/>
        </Container>
      </Layout>
    </>
  )
}

