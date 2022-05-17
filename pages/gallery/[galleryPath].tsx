import Layout from "@/components/layout";
import {
  getGalleryList,
  getGalleryByName,
} from '@/lib/api'
import {BLOG_NAME} from "@/lib/constants";
import Head from "next/head";
import {PageConfig} from "next";

export const getStaticPaths = async () => {
  const galleryList = await getGalleryList();
  let result = galleryList.map((item, index) => {
    return {
      params: {
        galleryPath: item.name,
      },
    }
  })
  return {
    paths: result,
    fallback: false,
  };
};

export const getStaticProps = async ({params}) => {
  const gallery = await getGalleryByName(params.galleryPath);

  return {
    props: {
      gallery
    }
  }
}

export const config: PageConfig = {
  unstable_runtimeJS: false
};

export default function Gallery({gallery}) {
  return (
    <Layout>
      <Head>
        <title>{`${gallery.name} | ${BLOG_NAME}`}</title>
      </Head>
      <div>
        <div className="gallery-banner -mt-10" style={{backgroundImage:`url("https://images.liyangzone.com/gallery/${gallery.name}/${gallery.cover}")`}}>
          <h3 className="gallery-desc text-2xl">{gallery.description}</h3>
        </div>
        <div className="photo-wrapper p-10 ">
          <div className="waterfall" id="gallery-box">
            {
              gallery.photos.map(photo=>(
                <div key={photo.name} data-src={`https://images.liyangzone.com/gallery/${gallery.name}/${photo.fileName}`}
                 className={"photo-item p-2 mb-3"}
                   data-fancybox="gallery"
                >
                  <img src={`https://images.liyangzone.com/gallery_tiny/${gallery.name}/${photo.fileName}`} alt=""/>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </Layout>
  )
}
