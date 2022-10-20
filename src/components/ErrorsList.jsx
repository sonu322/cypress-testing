import React from "react";
import ErrorIcon from "@atlaskit/icon/glyph/error";
import Banner from "@atlaskit/banner";
import styled from "styled-components";

const Container = styled.div`
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
export const ErrorsList = ({ errors }) => {
  console.log("from errors linst");
  console.log(errors);
  return (
    <Container>
      {errors.map((error, index) => {
        return (
          <Banner
            key={index}
            appearance="error"
            icon={<ErrorIcon label="" secondaryColor="inherit" />}
          >
            {error.message}
          </Banner>
        );
      })}
    </Container>
  );
};
