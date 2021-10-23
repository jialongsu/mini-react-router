import React, { Component } from "react";
import { Link, Switch, Route } from "react-router-dom";
import Animated from "animated/lib/targets/react-dom";
import ChevronLeft from "react-icons/lib/md/chevron-left";
import PropTypes from "prop-types";
import { Block, Col } from "jsxstyle";

import EnvironmentHeader from "./EnvironmentHeader.js";
import { RED } from "../Theme.js";
import Example from "./Example.js";
import API from "./APISmall.js";
import Guide from "./Guide.js";

const paths = {
  api: match => `${match.path}/api/:mod`,
  example: match => `${match.path}/example/:example`,
  guide: match => `${match.path}/guides/:mod/:header?`
};

export default class EnvironmentSmall extends Component {
  static propTypes = {
    data: PropTypes.object,
    match: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object
  };

  state = {
    // 0 = parent is active
    // 1 = child is active
    anim: new Animated.Value(this.props.match.isExact ? 0 : 1),
    animating: false
  };

  componentDidMount() {
    this.preloadExamples();
  }

  preloadExamples() {
    const { data } = this.props;
    data.examples.forEach(example => {
      // native doesn't have `load`
      if (example.load) example.load(() => {});
      // all have `loadSource`
      if (example.loadSource) example.loadSource(() => {});
    });
  }

  componentWillReceiveProps(nextProps) {
    const { anim } = this.state;

    // only animate if we're going from here to direct child.
    // child to child we'll ignore
    const goingToChild =
      nextProps.match.isExact === false && this.props.match.isExact === true;

    const comingFromChild =
      nextProps.match.isExact === true && this.props.match.isExact === false;

    if (goingToChild || comingFromChild) {
      this.setState(
        {
          animating: true
        },
        () => {
          Animated.timing(anim, {
            toValue: goingToChild ? 1 : 0,
            duration: 350
          }).start(() => {
            this.setState({
              animating: false
            });
          });
        }
      );
    }
  }

  render() {
    const { data, match, location } = this.props;
    const { anim, animating } = this.state;

    return (
      <Block
        position="absolute"
        left="0"
        right="0"
        bottom="0"
        top="0"
        overflow="hidden"
      >
        <Block position="relative" zIndex="1">
          <AnimatedHeaderBg anim={anim}>
            <AnimatedParentHeader anim={anim}>
              <EnvironmentHeader />
            </AnimatedParentHeader>
            <AnimatedChildHeader
              anim={anim}
              atParent={match.isExact}
              animating={animating}
            >
              <Switch location={location}>
                <Route
                  path={paths.api(match)}
                  render={({
                    match: {
                      params: { mod }
                    }
                  }) => (
                    <Header
                      url={match.url}
                      fontFamily="Menlo, monospace"
                      textTransform="none"
                    >
                      {getApiTitle(data, mod)}
                    </Header>
                  )}
                />
                <Route
                  path={paths.example(match)}
                  render={({
                    match: {
                      params: { example }
                    }
                  }) => (
                    <Header url={match.url}>
                      {getExampleTitle(data, example)}
                    </Header>
                  )}
                />
                <Route
                  path={paths.guide(match)}
                  render={({
                    match: {
                      params: { mod }
                    }
                  }) => (
                    <Header url={match.url}>{getGuideTitle(data, mod)}</Header>
                  )}
                />
              </Switch>
            </AnimatedChildHeader>
          </AnimatedHeaderBg>
        </Block>

        <AnimatedNav anim={anim}>
          <Nav anim={anim} data={data} environment={match.params.environment} />
        </AnimatedNav>

        <AnimatedChild
          anim={anim}
          atParent={match.isExact}
          animating={animating}
        >
          <Page>
            <Switch location={location}>
              <Route
                path={paths.api(match)}
                render={props => (
                  <API {...props} data={data} location={location} />
                )}
              />
              <Route
                path={paths.example(match)}
                render={props => <Example {...props} data={data} />}
              />
              <Route
                path={paths.guide(match)}
                render={props => <Guide {...props} data={data} />}
              />
            </Switch>
          </Page>
        </AnimatedChild>
      </Block>
    );
  }
}

function AnimatedHeaderBg({ anim, children }) {
  return (
    <Block
      position="absolute"
      top="0"
      left="0"
      right="0"
      fontSize="13px"
      background="linear-gradient(to bottom, rgba(221,221,221,1) 0%,rgba(221,221,221,1) 33%,rgba(221,221,221,0.9) 100%)"
      overflow="hidden"
    >
      <Animated.div
        style={{
          height: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [150, 50]
          })
        }}
      >
        {children}
      </Animated.div>
    </Block>
  );
}

AnimatedHeaderBg.propTypes = {
  anim: PropTypes.object,
  children: PropTypes.node
};

function AnimatedParentHeader({ anim, children }) {
  return (
    <Animated.div
      children={children}
      style={{
        position: "relative",
        top: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -50]
        }),
        opacity: anim.interpolate({
          inputRange: [0, 0.5],
          outputRange: [1, 0]
        })
      }}
    />
  );
}

AnimatedParentHeader.propTypes = {
  anim: PropTypes.object,
  children: PropTypes.node
};

function AnimatedNav({ anim, children }) {
  return (
    <Animated.div
      style={{
        position: "absolute",
        top: 0,
        width: "100%",
        bottom: 0,
        background: "white",
        left: anim.interpolate({
          inputRange: [0, 1],
          outputRange: ["0%", "-25%"]
        })
      }}
    >
      {children}
    </Animated.div>
  );
}

AnimatedNav.propTypes = {
  children: PropTypes.node,
  anim: PropTypes.object
};

class AnimatedChild extends Component {
  static propTypes = {
    children: PropTypes.node,
    anim: PropTypes.object,
    atParent: PropTypes.bool,
    animating: PropTypes.bool
  };

  state = {
    previousChildren: null
  };

  componentWillReceiveProps(nextProps) {
    const navigatingToParent = nextProps.atParent && !this.props.atParent;
    const animationEnded = this.props.animating && !nextProps.animating;

    if (navigatingToParent) {
      this.setState({
        previousChildren: this.props.children
      });
    } else if (animationEnded) {
      this.setState({
        previousChildren: null
      });
    }
  }

  render() {
    const { anim, children } = this.props;
    const { previousChildren } = this.state;
    return (
      <Animated.div
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          bottom: 0,
          background: "white",
          left: anim.interpolate({
            inputRange: [0, 1],
            outputRange: ["100%", "0%"]
          })
        }}
      >
        <Animated.div
          style={{
            position: "absolute",
            top: 0,
            width: "80px",
            bottom: 0,
            background:
              "linear-gradient(to left, rgba(0,0,0,0.20) 10%, rgba(255,255,255,0) 100%)",
            left: anim.interpolate({
              inputRange: [0, 1],
              outputRange: ["0px", "-80px"]
            })
          }}
        />
        {previousChildren || children}
      </Animated.div>
    );
  }
}

class AnimatedChildHeader extends Component {
  static propTypes = {
    children: PropTypes.node,
    anim: PropTypes.object,
    atParent: PropTypes.bool,
    animating: PropTypes.bool
  };

  state = { previousChildren: null };

  componentWillReceiveProps(nextProps) {
    const navigatingToParent = nextProps.atParent && !this.props.atParent;
    const animationEnded = this.props.animating && !nextProps.animating;

    if (navigatingToParent) {
      this.setState({
        previousChildren: this.props.children
      });
    } else if (animationEnded) {
      this.setState({
        previousChildren: null
      });
    }
  }

  render() {
    const { anim, children } = this.props;
    const { previousChildren } = this.state;
    return (
      <Animated.div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
          }),
          opacity: anim.interpolate({
            inputRange: [0, 0.75],
            outputRange: [0, 1]
          })
        }}
      >
        {previousChildren || children}
      </Animated.div>
    );
  }
}

const getApiTitle = (data, slug) => {
  const item = data.api.find(item => item.title.slug === slug);
  return item ? item.title.text : null;
};

const getExampleTitle = (data, slug) => {
  const item = data.examples.find(item => item.slug === slug);
  return item ? item.label : null;
};

const getGuideTitle = (data, slug) => {
  const item = data.guides.find(item => item.title.slug === slug);
  return item ? item.title.text : null;
};

class GoUp extends Component {
  static propTypes = {
    url: PropTypes.string
  };

  state = {
    justClicked: false
  };

  render() {
    const { url } = this.props;
    const { justClicked } = this.state;
    return (
      <Block
        component={Link}
        fontSize="45px"
        color={RED}
        opacity={justClicked ? "0.25" : "1"}
        lineHeight="0"
        className="no-tap-highlight"
        props={{
          to: url,
          onClick: () => this.setState({ justClicked: true })
        }}
        position="absolute"
        top="3px"
        left="-8px"
      >
        <ChevronLeft />
      </Block>
    );
  }
}

function Header({ children, url, ...rest }) {
  return (
    <Col
      justifyContent="center"
      fontSize="14px"
      width="100%"
      height="50px"
      textAlign="center"
      textTransform="uppercase"
      fontWeight="bold"
      position="relative"
      {...rest}
    >
      {children}
      <GoUp url={url} />
    </Col>
  );
}

Header.propTypes = {
  children: PropTypes.node,
  url: PropTypes.string
};

class Page extends Component {
  static childContextTypes = {
    scrollToDoc: PropTypes.string
  };

  getChildContext() {
    return { scrollToDoc: "mobile-page" };
  }

  render() {
    return (
      <Block
        props={{ id: "mobile-page" }}
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        background="white"
        paddingTop="50px"
        overflow="auto"
        className="mobile-scroll"
        {...this.props}
      />
    );
  }
}

function Title(props) {
  return (
    <Block
      textTransform="uppercase"
      fontWeight="bold"
      color="#aaa"
      padding="10px"
      fontSize="13px"
      marginTop="20px"
      {...props}
    />
  );
}

function NavLink({ to, ...props }) {
  return (
    <Route
      path={to}
      children={({ match }) => (
        <Block
          component={Link}
          className="no-tap-highlight"
          props={{ to }}
          padding="10px"
          borderTop="solid 1px #eee"
          background={match ? "#eee" : ""}
          activeBackground="#eee"
          {...props}
        />
      )}
    />
  );
}

NavLink.propTypes = { to: PropTypes.string };

function Nav({ environment, data }) {
  return (
    <Block
      position="absolute"
      className="mobile-scroll"
      top="0"
      bottom="0"
      left="0"
      width="100%"
      overflow="scroll"
      paddingTop="150px"
    >
      {Array.isArray(data.examples) && data.examples.length > 0 && (
        <Block>
          <Title>Examples</Title>
          <Block>
            {data.examples.map((item, i) => (
              <NavLink
                key={i}
                to={`/${environment}/example/${item.slug}`}
                children={item.label}
              />
            ))}
          </Block>
        </Block>
      )}

      <Block>
        <Title>Guides</Title>
        {data.guides.map((item, i) => (
          <NavLink
            key={i}
            to={`/${environment}/guides/${item.title.slug}`}
            children={item.title.text}
          />
        ))}
      </Block>

      <Block>
        <Title>API</Title>
        {data.api.map((item, i) => (
          <Block key={i} marginBottom="10px" fontFamily="Menlo, monospace">
            <NavLink
              key={i}
              to={`/${environment}/api/${item.title.slug}`}
              children={item.title.text}
            />
            <Block paddingLeft="10px" fontSize="90%">
              {item.headers.map((header, i) => (
                <NavLink
                  key={i}
                  to={`/${environment}/api/${item.title.slug}/${header.slug}`}
                  children={header.text}
                />
              ))}
            </Block>
          </Block>
        ))}
      </Block>
    </Block>
  );
}

Nav.propTypes = {
  data: PropTypes.object,
  environment: PropTypes.string
};
