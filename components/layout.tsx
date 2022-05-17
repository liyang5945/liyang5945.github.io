import Meta from './meta'
import Header from "./header";
import Footer from './footer'

type Props = {
  preview?: boolean
  children: React.ReactNode
}

const Layout = ({children}: Props) => {
  return (
    <>
      <Meta/>
      <Header/>
      <div className="blog-body pt-10 pb-10">
        {children}
      </div>
      <Footer/>
    </>
  )
}

export default Layout
