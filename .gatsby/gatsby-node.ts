import { resolve } from 'path'
import { createFilePath } from 'gatsby-source-filesystem'
import dayjs from 'dayjs'
import downloader from 'image-downloader'
import { token, siteConfigPageUrl, postListPageUrl } from '../nophyConfig'
import Nophy, { parseImageUrl } from '@phyzess/nophy'
import { ISiteMetaData } from './types'

const notion = new Nophy({
  token,
})

const navList = [
  {
    path: '/',
    name: 'phyzess',
    as: 'route',
  },
  {
    path: '/blog',
    name: 'Blog',
    as: 'route',
  },
  {
    path: '/playground',
    name: 'Playground',
    as: 'route',
  },
]

const getSiteConfigFromNotion = async (): Promise<ISiteMetaData> => {
  const siteConfigFromNotion = await notion.fetchPage(siteConfigPageUrl)
  const siteConfigData = siteConfigFromNotion.getRowData()

  let siteConfig = {} as ISiteMetaData
  for (const { valueType, name, value, image } of siteConfigData) {
    switch (valueType) {
      case 'text':
        siteConfig[name] = value
        break
      case 'number':
        siteConfig[name] = parseInt(value, 10)
        break
      case 'boolean':
        siteConfig[name] = Boolean(value) && value === '1'
        break
      case 'image':
        if (image.url) {
          let path: string
          if (name === 'avatar') {
            path = `static/avatar.png`
          } else if (name === 'icon') {
            path = `static/favicon.ico`
          }
          const options = {
            url: parseImageUrl(image.url),
            dest: path,
          }
          await downloader.image(options)
          siteConfig[name] = image
        }
        break
    }
  }

  return siteConfig
}

const getPostsFromNotion = async () => {
  const postListPage = await notion.fetchPage(postListPageUrl)
  return postListPage.loadPages((_) => _.status === 'completed')
}

export async function sourceNodes({ actions: { createNode }, createNodeId, createContentDigest }) {
  console.log('🦑 fetching site config data start >>>')
  const siteConfig = await getSiteConfigFromNotion()
  console.log('🦑 fetching site config data complete <<<')

  console.log('🦑 generating site meta start >>>')
  const siteCopyrightName = siteConfig.copyrightName
  const siteMeta = {
    ...siteConfig,
    navList,
  }
  createNode({
    ...siteMeta,
    name: `siteMeta_${siteCopyrightName}`,
    type: `siteMeta_${siteCopyrightName}`,
    id: createNodeId(`siteConfig@${dayjs().valueOf()}`),
    internal: {
      type: `siteMeta`,
      contentDigest: createContentDigest(siteMeta),
    },
  })
  console.log('🦑 generating site meta complete <<<')

  console.log('🦑 fetching post list data start >>>')
  const posts = await getPostsFromNotion()
  console.log('🦑 fetching post list data complete >>>')

  console.log('🦑 generating posts start >>>')
  createNode({
    posts,
    name: `posts`,
    type: `posts`,
    id: createNodeId(`posts@${dayjs().valueOf()}`),
    internal: {
      type: `posts`,
      contentDigest: createContentDigest(posts),
    },
  })
  console.log('🦑 generating posts end <<<')
}

export async function createPages({ graphql, actions }) {
  // const { createPage } = actions
  // const blogPost = resolve(`./src/templates/blog-post.tsx`)
  // const result = await graphql(
  //   `
  //     {
  //       allMarkdownRemark(
  //         sort: { fields: [frontmatter___date], order: DESC }
  //         limit: 1000
  //       ) {
  //         edges {
  //           node {
  //             fields {
  //               slug
  //             }
  //             frontmatter {
  //               title
  //             }
  //           }
  //         }
  //       }
  //     }
  //   `
  // )
  // if (result.errors) {
  //   throw result.errors
  // }
  // // Create blog posts pages.
  // const posts = result.data.allMarkdownRemark.edges
  // posts.forEach((post, index) => {
  //   const previous = index === posts.length - 1 ? null : posts[index + 1].node
  //   const next = index === 0 ? null : posts[index - 1].node
  //   createPage({
  //     path: post.node.fields.slug,
  //     component: blogPost,
  //     context: {
  //       slug: post.node.fields.slug,
  //       previous,
  //       next,
  //     },
  //   })
  // })
}

export function onCreateNode({ node, actions, getNode }) {
  // const { createNodeField } = actions
  // if (node.internal.type === `MarkdownRemark`) {
  //   const value = createFilePath({ node, getNode })
  //   createNodeField({
  //     name: `slug`,
  //     node,
  //     value: `blogs${value}`,
  //   })
  // }
}
