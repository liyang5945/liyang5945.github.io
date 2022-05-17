import {useRouter} from 'next/router'
import ErrorPage from 'next/error'

import Head from 'next/head'

import {BLOG_NAME} from '@/lib/constants'

import Layout from "@/components/layout";
import Container from '@/components/container'
import PostHeader from '@/components/post-header'
import PostBody from '@/components/post-body'
import ArticleToc from "@/components/article-toc";
import {
  getAllPosts,
  findPostByPath,
} from '@/lib/api'

import {PageConfig} from "next";

export const getStaticPaths = async () => {
  const posts = await getAllPosts();
  let result = posts.map((item) => {
    return {
      params: {
        articlePath: item.articlePath,
      },
    }
  })
  return {
    paths: result,
    fallback: false,
  };
};

export const getStaticProps = async ({params}) => {
  const rawArticle = await findPostByPath(params.articlePath);
  const article = JSON.parse(JSON.stringify(rawArticle))
  return {
    props: {
      article: {
        ...article
      }
    }
  }
}

export const config: PageConfig = {
  unstable_runtimeJS: false
};

export default function Article({article}) {
  const router = useRouter()
  if (!router.isFallback && !article?.articlePath) {
    return <ErrorPage statusCode={404}/>
  }
  return (
    <Layout>
      <Head>
        <title>{`${article.title} | ${BLOG_NAME}`}</title>
        <meta
          name="keywords"
          content={article.tags.join(' ')}
        />
        <meta
          name="description"
          content={article.excerpt}
        />
      </Head>
      <Container>
          <>
            <main className="flex">
              <article className={["article-content mb-5 rounded p-5 ",article.toc?'w-3/4':'w-full'].join('')}>
                <PostHeader title={article.title} date={article.date}/>
                <p className="mb-5 text-sm">
                  <span className="mr-3">发布日期：{article.date}</span>
                  <span>文章字数：{article.wordCount}K</span>
                </p>
                <PostBody content={article.content}/>
              </article>
              {article.toc && <ArticleToc toc={article.toc}/>}
            </main>
          </>
      </Container>
    </Layout>
  )
}
