require('dotenv').config();

const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;

module.exports = {
  pathPrefix: '/ip--gatsby-airtable-blog',
  siteMetadata: {
    title: 'IP News',
    siteUrl: 'https://example.com',
    description: 'News'
  },
  mapping: {
    'MarkdownRemark.frontmatter.author': 'AuthorsYaml'
  },
  plugins: [
    // Adding various source folders to the GraphQL layer.
    {
      resolve: 'gatsby-source-airtable',
      options: {
        apiKey: AIRTABLE_API_KEY,
        baseId: AIRTABLE_BASE_ID,
        tableName: 'CMS',
        tableView: 'Published',
        queryName: ''
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages/`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images/`
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: ``
      }
    },
    'gatsby-transformer-remark',
    'gatsby-transformer-json',
    'gatsby-transformer-yaml',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-plugin-offline',
    'gatsby-plugin-emotion',
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allAirtable } }) => {
              return allAirtable.edges.map(edge => {
                return {
                  title: edge.node.title,
                  date: edge.node.date,
                  description: edge.node.PostMarkdown,
                  url: site.siteMetadata.siteUrl + edge.node.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.slug
                };
              });
            },
            query: `
              {
                allAirtable(sort: { fields: [date], order: DESC }) {
                  edges {
                    node {
                      slug
                      title
                      PostMarkdown
                      image {
                        url
                      }
                      date
                    }
                  }
                }
              }
            `,
            output: '/rss.xml',
            title: 'Gatsby RSS Feed'
          }
        ]
      }
    },
    'gatsby-plugin-react-next',
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography.js'
      }
    }
  ]
};
