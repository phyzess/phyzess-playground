import React from 'react'
import { useLocation } from '@reach/router'
import { makeStyles } from '@material-ui/core'
import { Pagination, PaginationItem } from '@material-ui/lab'
import styled from '@emotion/styled'
import { useTheme, ITheme } from '@root/theme'
import Link from '@components/link'
import PostListItem from './Item'
import { IPost } from './types'

const useStyle = (theme: ITheme) =>
  makeStyles({
    paginationRoot: {
      display: 'flex',
      justifyContent: 'flex-end',
      margin: '2.5em auto 0',
      maxWidth: '800px',
    },
    paginationItemRoot: {
      color: theme.neuTextDefault,
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: 'transparent',
      },
      '&$selected': {
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
    },
    selected: {},
  })()

const PostListWrapper = styled.div`
  padding: 2em 0;
`

export interface IPostListProps {
  pageSize: number
  posts: IPost[]
}

const PostList: React.FC<IPostListProps> = ({ pageSize, posts }) => {
  const theme = useTheme()
  const cls = useStyle(theme)
  const { search } = useLocation()

  const pageCount = Math.ceil(posts.length / pageSize)
  const pageMatch = search.match(/^\?page=(\d)/)
  const page = pageMatch ? Number(pageMatch[1]) : 1
  const visiblePosts = posts.slice(0 + pageSize * (page - 1), pageSize * page)

  return (
    <PostListWrapper>
      {visiblePosts.map((_, index) => (
        <PostListItem key={_.rowId} postMeta={_} last={index === visiblePosts.length - 1} />
      ))}
      <Pagination
        hidePrevButton
        hideNextButton
        count={pageCount}
        classes={{ root: cls.paginationRoot }}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            neumorphism
            to={`/posts${item.page === 1 ? '' : `?page=${item.page}`}`}
            active={page === item.page}
            {...item}
            selected={page === item.page}
            classes={{ root: cls.paginationItemRoot, selected: cls.selected }}
          />
        )}
      />
    </PostListWrapper>
  )
}

export default PostList
