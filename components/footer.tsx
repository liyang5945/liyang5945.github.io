import Container from './container'
import {BLOG_NAME} from "@/lib/constants";

const Footer = () => {
  return (
    <footer className="blog-footer bg-neutral-50  border-neutral-200">
      <Container>
        <div className="md:flex justify-between block text-sm py-2">
          <div className="py-1 mx-3 text-center">Copyright © 2019 - 2022 {BLOG_NAME}
            <a href="http://beian.miit.gov.cn/"> 豫ICP备19028870号 </a>
          </div>
          <div className="py-1 mx-3 text-center"> Powered by
            <a href="https://nextjs.org/"> Next.js </a>
            &
            <a href="https://hexo.io/"> Hexo </a>
              Created by liyang</div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
