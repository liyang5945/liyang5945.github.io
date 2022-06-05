export function DarkModeScript() {
  return (
    <script
      id="DarkModeScript"
      dangerouslySetInnerHTML={{
        __html: `
    let html = document.documentElement;
    let  colorScheme = localStorage.getItem('colorScheme')
    if(colorScheme&&colorScheme=='dark'){
      html.setAttribute('data-color-mode', 'dark')
    } else {
      html.setAttribute('data-color-mode', 'light')
    }
    let btn_toggle_theme = document.querySelector('#btn_toggle_theme');
    btn_toggle_theme.addEventListener('click', function () {
    let theme = html.dataset.colorMode;
      if (theme == 'light') {
        html.setAttribute('data-color-mode', 'dark')
        localStorage.setItem('colorScheme','dark');
      } else if (theme == 'dark') {
        html.setAttribute('data-color-mode', 'light')
        localStorage.setItem('colorScheme','light');
      }
    })`
      }}
    />
  )
}

export function DynamicLoadScript() {
  return (
    <script id="DynamicLoadScript" dangerouslySetInnerHTML={{
      __html: `
function PromiseForEach(arr, cb) {
    let realResult = []
    let result = Promise.resolve()
    arr.forEach((a, index) => {
      result = result.then(() => {
        return cb(a).then((res) => {
          realResult.push(res)
        })
      })
    })
    return result.then(() => {
      return realResult
    })
 }
function addScript(url) {
   return new Promise((resolve, reject) => {
     let script = document.createElement('script');
     script.src = url;
     document.documentElement.appendChild(script);
     script.onload = ()=>{
       return resolve('success')
     }
     script.onerror = ()=>{
       return reject('error')
     }
   })
 }     
function AddCss(url) {
      document.head.insertAdjacentHTML("beforeend", \`<link rel="stylesheet" href="\${url}">\`);
}
`
    }}/>
  )
}

export function StatisticScript() {
  return <script id="StatisticScript" dangerouslySetInnerHTML={{
    __html: `
let runningOnBrowser = typeof window !== "undefined";
    let isBot = runningOnBrowser && !("onscroll" in window) || typeof navigator !== "undefined" && /(gle|ing|ro|msn)bot|crawl|spider|yand|duckgo/i.test(navigator.userAgent);
let supportsIntersectionObserver = runningOnBrowser && "IntersectionObserver" in window;
    if(!isBot&&supportsIntersectionObserver){
     addScript('https://hm.baidu.com/hm.js?3123469f7f81d45d6c4cd4a6a84ccf68');
     addScript('https://js.users.51.la/21306481.js');
    }
  `
  }}/>
}

export function ArchivesPropsScript(props) {
  return (
    <script id="ArchivesPropsScript" dangerouslySetInnerHTML={{
      __html: `
      window.totalArticleList = '${JSON.stringify(props.pageProps.articleList)}';
    `
    }}/>
  )
}

export function ArchivesScript() {
  return (
    <script id="ArchivesScript" dangerouslySetInnerHTML={{
      __html: `
function filterArchives() {
  let articleList = JSON.parse(window.totalArticleList);
  // 按年份分类全部文章
  function generateArchives(filterList) {
    const yearList = []
    let articleLength = filterList.length;
    for (let i = 0; i < articleLength; i++) {
      let articleItem = filterList[i]
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
    $('#archive-wrapper').empty();
    yearList.forEach(yearItem => {
      let yearEle = $(\`
        <div  class="year-item my-3">
        <h4 class="text-2xl">\${yearItem.year}</h4>
        <div class="article-link-wrapper mt-3 border-l border-gray-300"></div>
      \`)
      yearItem.children.forEach(article => {
        yearEle.find('.article-link-wrapper').append($(\`
         <div class="py-2 pl-3 relative -left-px  border-l-2 border-transparent hover:border-green-500 ">
                <span class="mr-3 text-sm text-gray-500">\${article.date}</span>
                <a href="/article/"\${article.slug}>\${article.title}</a>
              </div>
        \`))
      })
      $('#archive-wrapper').append(yearEle)
    })
  }

  $('.tag-item').on('click', evt => {
    changeTags(evt, 'tag')
  })
  $('.category-item').on('click', evt => {
    changeTags(evt, 'category')
  })

  function changeTags(evt, type) {
    const targetEle = $(evt.currentTarget)
    const selectTagOrCategory = targetEle.data(type)
    if (targetEle.hasClass('active')) {
      targetEle.removeClass('active')
      generateArchives(articleList)
    } else {
      const filterList = articleList.filter(item => item.tags.includes(selectTagOrCategory) || item.categories.includes(selectTagOrCategory))
      generateArchives(filterList)
      $('.tag-item,.category-item').removeClass('active');
      targetEle.addClass('active');
    }
  }
}

addScript('https://cdn.staticfile.org/jquery/2.2.0/jquery.min.js').then(res => {
  filterArchives();
}) `
    }}/>
  )
}

export function ArticleScript(props) {
  return (
    <script
      id="ArticleTocScript"
      dangerouslySetInnerHTML={{
        __html: `
       window.articleDate = '${props.pageProps.article.date}';
      let tocLinks = document.querySelectorAll('.toc-text');
      let targetLinks = document.querySelectorAll('.headerlink')
      tocLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
        let target = event.target
        event.preventDefault()
        event.stopPropagation()
        let parent = target.parentNode;
        let hash = decodeURI(parent.hash);
        let targetLink = Array.prototype.find.call(targetLinks, function (item) {
          return item.getAttribute('href') == hash
        })
        let top = targetLink.offsetTop
        window.scrollTo(0, top - 100)
        })
      })
      let dateInfoEle = document.querySelector('.date-info');
      var articleDate = new Date(window.articleDate)
    if(new Date().getTime()-articleDate.getTime()>180 * 24 * 3600 *1000){
      let date = Math.ceil((new Date().getTime()-articleDate.getTime())/24/3600/1000)
      dateInfoEle.style.display = 'block';
      dateInfoEle.innerText = \`本文发布于\${date}天前，文中所描述的信息可能已发生改变。\`
    }
addScript('https://unpkg.com/@highlightjs/cdn-assets@11.5.0/highlight.min.js').then(res => {
   document.querySelectorAll('pre code').forEach((el) => {
    hljs.highlightElement(el);
  });
})     
      `
      }}
    />
  )
}

export function GalleryScript() {
  return (
    <script id="GalleryScript" dangerouslySetInnerHTML={{
      __html: `
      // 加载justifiedGallery CSS文件
      AddCss('https://cdn.staticfile.org/justifiedGallery/3.7.0/css/justifiedGallery.min.css')
      let urlList = [
        'https://cdn.staticfile.org/jquery/2.2.0/jquery.min.js',
        'https://cdn.staticfile.org/justifiedGallery/3.7.0/js/jquery.justifiedGallery.min.js',
      ]
      PromiseForEach(urlList,addScript).then(res=>{
      //加载完jquery和justifiedGallery,先初始化justifiedGallery插件
        $("#gallery-box").justifiedGallery({margins: 5, rowHeight: 200});
        //再加载fancybox，这个是点击相册图片弹出的详情插件，因为这个文件有点耗时，后加载不影响页面显示，js加载完成后会自动初始化
        addScript('/libs/fancybox/fancybox.umd.js');
        AddCss('/libs/fancybox/fancybox.css');
      })`
    }}/>
  )
}
