import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { StaticQuery, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import 'what-input';
import {
  Button,
  Inline,
  List,
  ListItem,
  Modal,
  ModalBody,
  OffCanvas,
} from 'chaoskit/src/components';
import { styles } from 'chaoskit/src/helpers/styles';
import { TimelineMax } from 'gsap/TweenMax';

import CalibreRWeb from '../assets/fonts/Calibre-RWeb-Regular.woff';
import CalibreRWeb2 from '../assets/fonts/Calibre-RWeb-Regular.woff2';
import CalibreSemibold from '../assets/fonts/Calibre-RWeb-Semibold.woff';
import CalibreSemibold2 from '../assets/fonts/Calibre-RWeb-Semibold.woff2';

import { Icon, Link } from '../components';
import { config } from '../helpers/config';

import me from '../assets/media/me.png';
import '../assets/styles/site.scss';

class Foundation extends React.Component {
  state = {
    isAboutModalOpen: false,
    isArticlesOffCanvasOpen: false,
  };

  componentDidMount() {
    const { runAnimation } = this.props;

    if (runAnimation) this.runAnimation();
  }

  runAnimation = () => {
    const pageTimeline = new TimelineMax({
      delay: 0.5,
    });

    pageTimeline.staggerTo(
      '.header  > *',
      0.5,
      {
        y: 0,
        autoAlpha: 1,
        ease: config.ease,
      },
      0.1,
    );
  };

  handleAboutModalToggle = () => {
    const { isAboutModalOpen } = this.state;

    this.setState({
      isAboutModalOpen: !isAboutModalOpen,
    });
  };

  handleArticlesOffCanvasToggle = () => {
    const { isArticlesOffCanvasOpen } = this.state;

    this.setState({
      isArticlesOffCanvasOpen: !isArticlesOffCanvasOpen,
    });
  };

  render() {
    const {
      data: {
        site: {
          siteMetadata: { title, description, siteUrl },
        },
        articles: { edges: articles },
      },
      render,
    } = this.props;
    const { isAboutModalOpen, isArticlesOffCanvasOpen } = this.state;
    const { runAnimation } = this.props;

    const headerClasses = cx('header', {
      'has-animation': runAnimation,
    });

    return (
      <Fragment>
        <Helmet
          title={title}
          meta={[
            { name: 'description', content: description },
            { name: 'og:image', content: `${siteUrl}${me}` },
          ]}
        >
          {/* Adding in webfonts here to get around strange Gatsby issue https://github.com/gatsbyjs/gatsby/issues/9826 */}
          <style type="text/css">
            {`
              @font-face {
                font-family: Calibre;
                src: local(😜), url(${CalibreRWeb2}) format('woff2'), url(${CalibreRWeb}) format('woff');
                font-weight: ${styles.typography.weight.normal};
                font-style: normal;
              }

              @font-face {
                font-family: Calibre;
                src: local(😜), url(${CalibreSemibold2}) format('woff2'), url(${CalibreSemibold}) format('woff');
                font-weight: ${styles.typography.weight.bold};
                font-style: normal;
              }
            `}
          </style>
        </Helmet>
        <div className="site-wrapper">
          <div className="container container--small">
            <header className={headerClasses}>
              <div>
                <Link to="/" className="header-logo" title={title} />
              </div>
              <div>
                <Button
                  type="reset"
                  className="header-menu"
                  onClick={this.handleArticlesOffCanvasToggle}
                >
                  <Icon icon="menu" />
                </Button>
                <OffCanvas
                  open={isArticlesOffCanvasOpen}
                  onOffCanvasToggle={this.handleArticlesOffCanvasToggle}
                >
                  <h2 className="offCanvas-title">Articles</h2>
                  <List className="bubbleList">
                    {articles.map(({ node }) => (
                      <ListItem
                        key={node.frontmatter.title}
                        className="bubbleList-item"
                      >
                        <div className="bubbleList-item-bubble" />
                        <div className="bubbleList-item-info">
                          <Link
                            className="bubbleList-item-link"
                            to={node.fields.fullUrl}
                          >
                            {node.frontmatter.title}
                          </Link>
                          <p className="u-mt--remove u-textMedium u-textMuted">
                            {moment(node.frontmatter.date).format('LL')}
                          </p>
                        </div>
                      </ListItem>
                    ))}
                  </List>
                </OffCanvas>
              </div>
              <div>
                <Button
                  type="reset"
                  className="header-about"
                  onClick={this.handleAboutModalToggle}
                >
                  <img src={me} alt={title} />
                </Button>
                <Modal
                  open={isAboutModalOpen}
                  handleOutsideModalClick={this.handleAboutModalToggle}
                >
                  <ModalBody>
                    <img src={me} className="aboutModal-image" alt={title} />
                    <h3 className="u-textCenter u-mb--small">
                      Hi, I&apos;m Zach
                    </h3>
                    <Inline size="medium" className="u-flexCenter">
                      <Button
                        url="https://www.github.com/zslabs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aboutModal-social--github"
                        iconOnly
                        title="GitHub"
                      >
                        <Icon icon="github" />
                      </Button>
                      <Button
                        url="https://www.github.com/zslabs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aboutModal-social--codepen"
                        iconOnly
                        title="CodePen"
                      >
                        <Icon icon="codepen" />
                      </Button>
                      <Button
                        url="https://www.twitter.com/zslabs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aboutModal-social--twitter"
                        iconOnly
                        title="Twitter"
                      >
                        <Icon icon="twitter" />
                      </Button>
                    </Inline>
                    <p className="u-mv--large">
                      I create buttons, borders, and other groovy things at{' '}
                      <a
                        href="https://www.gremlin.com"
                        className="u-textUnderline u-textDefault"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Gremlin
                      </a>
                      . I work with techologies like{' '}
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://reactjs.org"
                        className="u-textUnderline u-textDefault"
                      >
                        ReactJS
                      </a>
                      ,{' '}
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://gatsbyjs.org"
                        className="u-textUnderline u-textDefault"
                      >
                        GatsbyJS
                      </a>
                      , and{' '}
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://nodejs.org"
                        className="u-textUnderline u-textDefault"
                      >
                        NodeJS
                      </a>
                      . My background involves pushing the limits of what we can
                      build on the backend and how we can experience it on the
                      frontend. My passions are perfecting process and educating
                      those around me.
                    </p>
                    <h4 className="u-textFluid--xlarge">Speaking/Consulting</h4>
                    <p>
                      Have an event and/or consluting project you&apos;d like me
                      to be a part of? Awesome!{' '}
                      <a
                        className="u-textUnderline u-textDefault"
                        href="mailto:info@zslabs.com"
                      >
                        Let&apos;s chat
                      </a>
                      .
                    </p>
                    <h4 className="u-textFluid--xlarge">
                      How&apos;d you build this site?!
                    </h4>
                    <p>
                      Because I love open-source—it&apos;s available for anyone
                      to view. Find a bug? Report it!{' '}
                      <a
                        className="u-textUnderline u-textDefault"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/zslabs/zslabs.com"
                      >
                        View source
                      </a>
                      .
                    </p>
                    <div className="u-mt--large u-textCenter">
                      <span className="u-textMuted">
                        Copyright © {new Date().getFullYear()} Zach Schnackel.
                        Penalty is
                      </span>{' '}
                      🔥
                    </div>
                  </ModalBody>
                </Modal>
              </div>
            </header>
            <main>
              {render({
                handleArticlesOffCanvasToggle: this
                  .handleArticlesOffCanvasToggle,
              })}
            </main>
          </div>
        </div>
      </Fragment>
    );
  }
}

Foundation.propTypes = {
  render: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  runAnimation: PropTypes.bool,
};

export default props => (
  <StaticQuery
    query={graphql`
      query FoundationPageData {
        site: site {
          siteMetadata {
            title
            description
            siteUrl
          }
        }

        articles: allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          filter: {
            fileAbsolutePath: { regex: "/src/articles/" }
            frontmatter: { title: { ne: "BLUEPRINT" } }
          }
        ) {
          totalCount
          edges {
            node {
              fileAbsolutePath
              html
              timeToRead
              frontmatter {
                title
                date
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
    `}
    render={data => <Foundation data={data} {...props} />}
  />
);