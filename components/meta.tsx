import Head from 'next/head'
import {BLOG_NAME} from '@/lib/constants'

const Meta = () => {
    return (
        <Head>
            <link rel="shortcut icon" href="/medias/favicon.png"/>
            <meta content="width=device-width, initial-scale=1, viewport-fit=cover" name="viewport"/>
            <meta content="on" httpEquiv="x-dns-prefetch-control"/>
            <meta content="telephone=no" name="format-detection"/>
            <meta
                name="keywords"
                content={BLOG_NAME}
            />
            <meta
                name="description"
                content={BLOG_NAME}
            />
        </Head>
    )
}

export default Meta
