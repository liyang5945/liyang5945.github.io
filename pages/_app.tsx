import { AppProps } from 'next/app'
import '../styles/index.css'
import '../styles/custom.sass'
import '../styles/custom-markdown.scss'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  )
}
