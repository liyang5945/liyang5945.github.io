import {
  getGalleryList,
} from "@/lib/api";
import Layout from "@/components/layout";
import Head from "next/head";
import {BLOG_NAME} from "@/lib/constants";
import Container from "@/components/container";
import {PageConfig} from "next";

export async function getStaticProps() {

  const galleryList = await getGalleryList()

  return {
    props: {
      galleryList,
    },
  }
}
export const config: PageConfig = {
  unstable_runtimeJS: false
};
function galleryList({galleryList}) {
  return (
    <>
      <Layout>
        <Head>
          <title>{`相册 | ${BLOG_NAME}`}</title>
        </Head>
        <div className="gallery-banner -mt-10" style={{backgroundImage:`url("https://images.liyangzone.com/medias/banner/6.jpg")`}}>
          <h3 className="gallery-desc text-2xl">用照片记录生活的点点滴滴</h3>
        </div>
        <Container>
          <div className="gallery-wrapper mt-8 grid md:grid-cols-3 grid-cols-2 gap-2  md:gap-4">
            {
              galleryList.map(gallery => (
                <div key={gallery.name} className="gallery-box p-2 ">
                  <a href={`./${gallery.name}`} className={"gallery-item p-2 pb-0  border"}>
                    <div className={"gallery-cover-box "}
                         style={{backgroundImage: `url(https://images.liyangzone.com/gallery_tiny/${gallery.name}/${gallery.cover})`}}>
                    </div>
                    <p className={"gallery-name text-center text-sm leading-8"}>{gallery.name}</p>
                  </a>
                </div>
              ))
            }
          </div>
        </Container>
      </Layout>
    </>
  )
}

export default galleryList
