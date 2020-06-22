import React from 'react'
import { PageProps, graphql } from 'gatsby'
import { Container, makeStyles } from '@material-ui/core'
import { IPage } from '@phyzess/nophy'
import withRoot from '@/root'
import Layout from '@components/layouts'
import Header from './Header'
import Article from './Article'
import Footer, { IFooterProps } from './Footer'

const useStyles = makeStyles({
  containerRoot: {
    padding: '3em 0',
  },
})

interface IPostProps extends PageProps {
  pageContext: Pick<IFooterProps, 'previous' | 'next'>
  data: {
    allPost: {
      nodes: {
        name: string
        last_edited_time: number
        created_time: number
        keywords: string
        tags: string
        rowId: string
        id: string
        article: IPage['article']
      }[]
    }
  }
}

const Post: React.FC<IPostProps> = ({
  pageContext: { next, previous },
  data: {
    allPost: {
      nodes: [{ name, last_edited_time, created_time, keywords, tags, rowId, id, article }],
    },
  },
}) => {
  const cls = useStyles()

  return (
    <Layout>
      <Container classes={{ root: cls.containerRoot }} maxWidth='lg'>
        <Header title={name} createTime={created_time} />
        <Article article={article} />
        <Footer next={next} previous={previous} lastEditedTime={last_edited_time} tags={tags} />
      </Container>
    </Layout>
  )
}

export const query = graphql`
  query PhyzessPost($id: String) {
    allPost(filter: { id: { eq: $id } }) {
      nodes {
        name
        last_edited_time
        created_time
        keywords
        tags
        rowId
        id
        article {
          ...PostArticleFragment
        }
      }
    }
  }
`

export default withRoot(Post)