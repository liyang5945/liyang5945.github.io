import {BLOG_NAME} from "@/lib/constants";

export default function Header() {
  return (
    <div className="blog-header min-w-full">
      <div className="container max-w-screen-lg px-2 clear-both">
        <div className="block text-center sm:inline-block sm:text-left ">
          <div className=" inline-block align-top rounded-full my-2 mr-2 w-8 h-8 overflow-hidden bg-blue-400">
            <img className="site-logo" src="/medias/avatar.jpg" alt=""/>
          </div>
          <span className=" inline-block align-top mt-2.5  text-xl">{BLOG_NAME}</span>
        </div>
        <div className="block text-center sm:inline-block sm:text-left  sm:float-right">
          <a className="inline-block nav-link py-3 px-2" href="/">首页</a>
          <a className="inline-block nav-link py-3 px-2" href="/archives/">归档</a>
          <a className="inline-block nav-link py-3 px-2" href="/gallery/">相册</a>
          <a className="inline-block nav-link py-3 px-2" href="/about/">关于</a>
          <span className="inline-block nav-link py-3 px-2"  id="btn_toggle_theme" title="切换暗色模式">
            <i className="theme-icon"/>
          </span>
        </div>
      </div>
    </div>
  )
}
