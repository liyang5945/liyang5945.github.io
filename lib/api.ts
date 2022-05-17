import toc from 'hexo/lib/plugins/helper/toc';
import {stripHTML} from 'hexo/lib/plugins/helper/format'
import {join} from 'path';

import fs from 'fs'

import initHexo from "../hexo";
import hexoIndexGenerator from 'hexo-generator-index/lib/generator';

/**
 * 文章字数统计
 * @param: post.content
 * @return: [中文字数,英文字数]
 */
function wordCounter(content) {
  content = stripHTML(content);
  const cn = (content.match(/[\u4E00-\u9FA5]/g) || []).length;
  const en = (content.replace(/[\u4E00-\u9FA5]/g, '').match(/[a-zA-Z0-9_\u0392-\u03c9\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|[\u00E4\u00C4\u00E5\u00C5\u00F6\u00D6]+|\w+/g) || []).length;
  return [cn, en];
}


/**
 * 获取所有文章列表
 * @param: empty
 * @return: postList
 */
export async function getAllPosts() {
  const hexo = await initHexo();
  let rawPostList = hexo.database.model('Post').find({}).sort('-date')
  return rawPostList.map(post => {
    return {
      title: post.title,
      date: post.date.format('MM-DD'),
      year: post.date.format("YYYY"),
      articlePath: post.articlePath,
      tags: post.tags.find({}).map(item => item.name),
      categories: post.categories.find({}).map(item => item.name),
    }
  })
}


/**
 * 获取指定路径文章详情
 * @param: articlePath
 * @return: post
 */
export async function findPostByPath(articlePath) {
  const hexo = await initHexo();
  const post = hexo.database.model('Post').findOne({articlePath: articlePath});
  const len = wordCounter(post.content);
  const count = len[0] + len[1];
  return {
    title: post.title,
    date: post.date.format('YYYY-MM-DD'),
    author: post.author,
    wordCount: Math.round(count / 100) / 10,
    toc: toc(post.content, {
      list_number: false,
      max_depth: 4
    }),
    tags: post.tags.find({}).map(item => item.name),
    excerpt: post.excerpt || stripHTML(post.content).substring(0, 200) + '……',
    updated: post.updated,
    content: post.content,
    articlePath: post.articlePath,
  }
}

/**
 * 获取所有文章标签
 * @param: empty
 * @return: tagList
 */
export async function fetchAllTags() {
  const hexo = await initHexo();

  const tags = hexo.database.model('Tag').find({});
  return tags.map(tagItem => {
    return {
      name: tagItem.name,
      id: tagItem._id,
      length: tagItem.length
    }
  })
}

/**
 * 获取所有文章分类
 * @param: empty
 * @return: CategoryList
 */
export async function fetchAllCategory() {
  const hexo = await initHexo();

  const categories = hexo.database.model('Category').find({});
  return categories.map(tagItem => {
    return {
      name: tagItem.name,
      id: tagItem._id,
      length: tagItem.length
    }
  })
}

/**
 * 生成页面导航器
 * @param: empty
 * @return: PaginationList
 */
export const buildIndexPagination = async () => {
  const hexo = await initHexo();
  return hexoIndexGenerator.call(hexo, hexo.locals.toObject())
};


/**
 * 获取指定页面文章
 * @param: pageIndex
 * @return: postList
 */
export async function getArticlesByIndex(index) {
  const hexo = await initHexo();
  const data = hexoIndexGenerator.call(hexo, hexo.locals.toObject());
  let matchIndexPage = data.find(item => item.data.current == index)
  return matchIndexPage.data.posts.find({}).sort('-date').map(post => {
    return {
      title: post.title,
      date: post.date.format('YYYY-MM-DD'),
      articlePath: post.articlePath,
      more: post.more,
      excerpt: post.excerpt || stripHTML(post.content).substring(0, 200) + '……',
      tags: post.tags.find({}).map(item => item.name),
      categories: post.categories.find({}).map(item => item.name),
    }
  });
}

/**
 * 获取指定页面导航器
 * @param: pageIndex
 * @return: PaginationInfo
 */
export async function getPagePaginatorByIndex(index) {
  const hexo = await initHexo();
  const data = hexoIndexGenerator.call(hexo, hexo.locals.toObject());
  let matchIndexPage = data.find(item => item.data.current == index)
  return {
    path: matchIndexPage.path,
    base: matchIndexPage.data.base,
    total: matchIndexPage.data.total,
    current: matchIndexPage.data.current,
    current_url: matchIndexPage.data.current_url,
    prev: matchIndexPage.data.prev,
    prev_link: matchIndexPage.data.prev_link,
    next: matchIndexPage.data.next,
    next_link: matchIndexPage.data.next_link,
  }
}

/**
 * 获取相册列表
 * @param: empty
 * @return: galleyList
 */
export async function getGalleryList() {
  const galleryDataPath = join(process.cwd(), '/source/_data/gallery.json')
  const galleryContents = fs.readFileSync(galleryDataPath, 'utf8')
  return JSON.parse(galleryContents)
}

/**
 * 获取单个相册
 * @param: galleryName
 * @return: galleyInfo
 */
export async function getGalleryByName(name) {
  const list = await getGalleryList()
  return list.find(item => item.name == name)
}

/**
 * 获取友链
 * @param: empty
 * @return: friendList
 */
export async function getFiendList() {
  const galleryDataPath = join(process.cwd(), '/source/_data/friends.json')
  const galleryContents = fs.readFileSync(galleryDataPath, 'utf8')
  return JSON.parse(galleryContents)
}

/**
 * 获取站点信息，分类数、标签数、文章字数等
 * @param: empty
 * @return: siteInfo
 */
export async function getSiteInfo() {
  const hexo = await initHexo();
  const posts = hexo.database.model('Post').find({});
  const tags = hexo.database.model('Tag').find({});
  const categories = hexo.database.model('Category').find({});

  let count = 0;
  posts.forEach(function (post) {
    const len = wordCounter(post.content);
    count += len[0] + len[1];
  });
  if (count < 1000) {
    return count;
  }
  return {
    postCount: posts.length,
    tagCount: tags.length,
    categoryCount: categories.length,
    wordCount: Math.round(count / 1000) / 10 // 总字数，单位万字
  }
}




