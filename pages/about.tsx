import {PageConfig} from 'next';
import Layout from "@/components/layout";
import Head from "next/head";
import {BLOG_NAME} from "@/lib/constants";
import Container from "@/components/container";
import {getSiteInfo,getFiendList} from "@/lib/api";


export const config: PageConfig = {
  unstable_runtimeJS: false
};


export const getStaticProps = async () => {
  const siteInfo = await getSiteInfo()
  const friendList = await getFiendList();

  return {
    props: {
      siteInfo,
      friendList
    }
  }
}

export default function AboutPage({siteInfo,friendList}) {

  return (
    <>
      <Layout>
        <Head>
          <title>{`关于 | ${BLOG_NAME}`}</title>
        </Head>

        <Container>
          <div className="blog-info text-center rounded-sm p-10">
            <div style={{width: '180px'}} className="avatar inline-block overflow-hidden rounded-full">
              <img src="/medias/avatar.jpg" alt=""/>
            </div>
            <p className="text-xl my-2 leading-8">liyang</p>
            <p className="text leading-8 my-2">生命不息、折腾不止。</p>
            <div className="flex justify-center pt-2  blog-statistic">
              <div className="statistic-item mx-4">
                <p className="count text-xl font-bold">{siteInfo.postCount}</p>
                <h4 className="name">文章</h4>
              </div>
              <div className="statistic-item mx-4">
                <p className="count text-xl font-bold">{siteInfo.categoryCount}</p>
                <h4 className="name">分类</h4>
              </div>
              <div className="statistic-item mx-4">
                <p className="count text-xl font-bold">{siteInfo.tagCount}</p>
                <h4 className="name">标签</h4>
              </div>
              <div className="statistic-item mx-4">
                <p className="count text-xl font-bold">{siteInfo.wordCount}</p>
                <h4 className="name">万字</h4>
              </div>
            </div>
            <div className="about-me text-left">
              <h3 className="text-xl leading-10 font-bold my-4">关于我：</h3>
              <p className="text-base leading-8">一名前端开发者，也是一个技术宅，喜欢捣鼓各种软硬件、电子产品、钻研技术，崇尚极客精神。</p>
              <p className="text-base leading-8">人生理念：生命不息，折腾不止。自己动手，丰衣足食。</p>
              <p className="text-base leading-8">爱好相关：电影、美剧、游戏(主要玩一些单机游戏、主机游戏、Dota2云玩家）、骑行。</p>
              <h3 className="text-xl leading-10 font-bold my-4">关于博客：</h3>
              <p className="text-base leading-8">写这个博客的目的就是分享一些开发中遇到的问题，解决的方法，也会分享一些实用的软件和技巧、折腾经历、生活记录等。</p>
              <h3 className="text-xl leading-10 font-bold my-4">博客记录：</h3>
              <p
                className="text-base leading-8">2019年7月初，开始有了建博客的idea。初步采用hexo静态博客，使用hexo-theme-matery主题，并做了一些修改。博客文件放在腾讯云COS，并配置CDN静态加速。</p>
              <p className="text-base leading-8">2022年5月重构为react+nextjs+SSG，使用TypeScript、tailwind.css进行开发。并做了一些优化，提升加载速度。使用github
                actions发布。博客源码地址: <a style={{color:'var(--link)'}} href="https://github.com/liyang5945/liyang5945.github.io" target="_blank"
                                       rel="noopener">点击前往</a>。新版在blog-source分支，旧版文件也还在，在blog-old分支。</p>
            </div>
          </div>
          <div className="blog-info rounded-sm py-2 px-3 my-5">
            <h3 className="text-2xl leading-10 font-bold my-4">友情链接：</h3>

          </div>
          <div className="friend-wrapper grid grid-cols-1 sm:grid-cols-2 gap-5">
            {
              friendList.map(friend=>(
                <a key={friend.name} href={`${friend.url}`} className="friend-item flex p-3 rounded-sm ">
                  <div style={{backgroundImage:`url("${friend.avatar}")`}} className="friend-avatar rounded-full overflow-hidden flex-shrink-0">
                  </div>
                  <div className="friend-info flex-shrink pl-3 pt-2">
                    <h3 className="friend-name text-xl font-bold my-1">{friend.name}</h3>
                    <p>{friend.introduction}</p>
                  </div>
                </a>
              ))
            }

          </div>
        </Container>
      </Layout>
    </>
  )
}

