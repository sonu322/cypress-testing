import React from "react";
import ErrorIcon from "@atlaskit/icon/glyph/error";
import Banner from "@atlaskit/banner";
import styled from "styled-components";

const Container = styled.div`
  margin-bottom: 24px;
`;
export const ErrorBanner = () => {
  return (
    <Container>
      <Banner
        appearance="error"
        icon={<ErrorIcon label="" secondaryColor="inherit" />}
      >
        Bitbucket is experiencing an incident, but we’re on it. Check our status
        page for more details.{" "}
      </Banner>
    </Container>
  );
};
