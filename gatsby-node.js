/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const StylelintPlugin = require('stylelint-webpack-plugin');

// Custom Webpack configuration
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  // Include `chaoskit` and `query-string` in transpiled JS files
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.js$|\.jsx$/,
          exclude: modulePath => /node_modules/.test(modulePath)
            && !/node_modules\/(chaoskit)/.test(modulePath),
          use: loaders.js(),
        },
      ],
    },
  });

  if (['develop'].includes(stage)) {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /\.js$|\.jsx$/,
            exclude: /(node_modules|cache|public)/,
            use: [
              {
                loader: 'eslint-loader',
              },
            ],
          },
        ],
      },
      plugins: [
        new StylelintPlugin({
          files: ['src/assets/styles/**/*.scss'],
          configFile: 'stylelint.config.js',
          syntax: 'scss',
          emitErrors: false,
        }),
      ],
    });
  }
};

const path = require('path');
const _ = require('lodash');
const { attachFields } = require('gatsby-plugin-node-fields');

//
// Lifecycle methods
//

function attachFieldsToNodes({ node, actions }) {
  if (node.internal.type !== 'MarkdownRemark') {
    return;
  }

  const { slug, title } = node.frontmatter;
  const articlePath = slug || _.kebabCase(_.toLower(title));
  const fullUrl = `/articles/${articlePath}/`;

  attachFields(node, actions, [
    // Custom slug
    {
      predicate: () => true, // Attach this to any markdown-generated files to allow for custom slugs
      fields: [
        {
          name: 'slug',
          getter: nodeObject => nodeObject.frontmatter.slug,
          defaultValue: articlePath,
          validator: value => value && value.trim() !== '', // Check against empty slugs
        },
      ],
    },
    // Full URL
    {
      predicate: () => true, // Attach this to any markdown-generated files to allow for custom slugs
      fields: [
        {
          name: 'fullUrl',
          defaultValue: fullUrl,
        },
      ],
    },
  ]);
}

// eslint-disable-next-line func-names
exports.onCreateNode = function (...args) {
  return Promise.all([attachFieldsToNodes].map(fn => fn.apply(this, args)));
};

function getMarkdownQuery({ regex } = {}) {
  return `
    {
      allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        filter: {
          fileAbsolutePath: { regex: "${regex}" }
          frontmatter: { title: { ne: "BLUEPRINT" } }
        }
      ) {
        totalCount
        edges {
          node {
            fileAbsolutePath
            html
            excerpt(pruneLength: 120)
            timeToRead
            frontmatter {
              title
              date
              dateModified
              slug
            }
            fields {
              slug
              fullUrl
            }
          }
        }
      }
    }
  `;
}

function createSinglePages({
  createPage,
  edges,
  context,
  filename = 'Single',
}) {
  const component = path.resolve(`src/templates/${context}/${filename}.js`);

  edges.forEach(({ node }) => {
    const { slug, title } = node.frontmatter;
    const articlePath = slug || _.kebabCase(_.toLower(title));

    createPage({
      path: `/articles/${articlePath}`,
      component,
      context: {
        slug: articlePath,
        fileAbsolutePath: node.fileAbsolutePath,
      },
    });
  });
}

exports.createPages = async ({ actions, graphql }) => {
  const results = await Promise.all([
    graphql(getMarkdownQuery({ regex: '/src/articles/' })),
  ]);

  const [articleResults] = results;
  const { createPage } = actions;
  const articleEdges = articleResults.data.allMarkdownRemark.edges;

  //
  // Articles
  //
  createSinglePages({
    createPage,
    edges: articleEdges,
    context: 'articles',
  });
};
