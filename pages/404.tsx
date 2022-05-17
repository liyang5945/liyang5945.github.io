import {PageConfig} from 'next';
import Layout from "@/components/layout";
import Head from "next/head";

export const config: PageConfig = {
  unstable_runtimeJS: false
};


export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>404</title>
      </Head>
      <div className="flex items-center justify-center h-full  mx-2 my-2 overflow-hidden ">
        <div className="px-6 py-4 rounded shadow">
          <div className="mb-2 text-xl font-bold">
            404 - 页面找不到了
          </div>
          <div>
            <p className="leading-8">本站最近作了一些调整，原来的地址已经失效，内容都还在。</p>
            <p className="leading-8">你可以前往
              <a style={{color:'var(--link)'}} className="font-bold" href="/archives/">归档</a>
              页面查看所有历史文章。</p>
          </div>
        </div>
      </div>
    </Layout>

  )
}

