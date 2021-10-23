import React from "react";
import { Block, Row } from "jsxstyle";

import { DARK_GRAY } from "../Theme.js";
import LogoImage from "../logo.png";

export default function Logo({ size = 230, shadow = true }) {
  return (
    <Row
      background={DARK_GRAY}
      width={size + "px"}
      height={size + "px"}
      alignItems="center"
      justifyContent="center"
      borderRadius="50%"
      boxShadow={
        shadow ? `2px ${size / 20}px ${size / 5}px hsla(0, 0%, 0%, 0.35)` : null
      }
    >
      <Block position="relative" top="-4%" textAlign="center" width="100%">
        <img src={LogoImage} alt="React Training" width="75%" />
      </Block>
    </Row>
  );
}
