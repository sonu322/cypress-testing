import React from "react";
import { JQLEditorConnect } from "@atlassianlabs/jql-editor-connect";
import styled from "styled-components";
const Container = styled.div`
flex-grow: 1;
display: flex;
height: 64px;
max-width: 480px;
overflow: auto;
`
export const JQLEditor = () => {
  const onSearch = (jql: string) => {
    // Do some action on search
    console.log(jql)
  };

  return <Container><JQLEditorConnect query={""} onSearch={onSearch} locale={"en"} /></Container>;
};
