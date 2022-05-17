import Document, {Html, Head, Main, NextScript} from 'next/document'

import {
  DarkModeScript,
  ArticleScript,
  ArchivesPropsScript,
  ArchivesScript,
  DynamicLoadScript,
  GalleryScript,
  StatisticScript,
} from "@/components/external-script"

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="zh-cn"
            data-color-mode="light"
      >
        <Head/>
        <body>
        <Main/>
        <NextScript/>
        </body>
        <DarkModeScript/>
        <DynamicLoadScript/>
        {this.props.__NEXT_DATA__.page=='/article/[articlePath]' && <ArticleScript {...this.props.__NEXT_DATA__.props}/>}
        {this.props.__NEXT_DATA__.page=='/archives' && <ArchivesPropsScript {...this.props.__NEXT_DATA__.props}/>}
        {this.props.__NEXT_DATA__.page=='/archives' && <ArchivesScript />}
        {this.props.__NEXT_DATA__.page=='/gallery/[galleryPath]' && <DynamicLoadScript/>}
        {this.props.__NEXT_DATA__.page=='/gallery/[galleryPath]' && <GalleryScript/>}
        <StatisticScript/>
      </Html>
    )
  }
}
