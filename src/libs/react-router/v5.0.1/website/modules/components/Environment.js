import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";

import EnvironmentLarge from "./EnvironmentLarge.js";
import EnvironmentSmall from "./EnvironmentSmall.js";
import Bundle from "./Bundle.js";
import SmallScreen from "./SmallScreen.js";
import Loading from "./Loading.js";

const envData = {
  web: require("bundle-loader?lazy!../docs/Web"),
  native: require("bundle-loader?lazy!../docs/Native"),
  core: require("bundle-loader?lazy!../docs/Core")
};

export default function Environment({
  history,
  location,
  match,
  match: {
    params: { environment }
  }
}) {
  useEffect(() => {
    Object.keys(envData).forEach(key => envData[key](() => {}));
  }, []);

  if (!envData[environment]) return <Redirect to="/" />;

  return (
    <SmallScreen>
      {isSmallScreen => (
        <Bundle load={envData[environment]}>
          {data =>
            data ? (
              isSmallScreen ? (
                <EnvironmentSmall
                  data={data}
                  match={match}
                  location={location}
                  history={history}
                />
              ) : (
                <EnvironmentLarge data={data} match={match} />
              )
            ) : (
              <Loading />
            )
          }
        </Bundle>
      )}
    </SmallScreen>
  );
}

Environment.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.shape({
    params: PropTypes.shape({
      environment: PropTypes.string
    })
  })
};
