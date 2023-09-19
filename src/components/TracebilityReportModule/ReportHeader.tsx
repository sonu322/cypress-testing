import React from "react";
import styled from "styled-components";
import { IssueField, IssueLinkType, IssueType } from "../../types/api";
import { toTitleCase } from "../../util";
import { HeaderCell } from "./HeaderCell";
import { token } from "@atlaskit/tokens";
import { colors } from "@atlaskit/theme";

interface Props {
  fields: IssueType[] | IssueLinkType[];
  selectedFieldIds: string[];
}

// TODO: sticky header will not work in IE11
const Th = styled.th`
  border: 1px solid ${token("color.border", colors.N40)};
  position: -webkit-sticky; // this is for all Safari (Desktop & iOS), not for Chrome
  position: sticky;
  top: 0;
  z-index: 1; // any positive value, layer order is global
  background-color: ${token("elevation.surface.overlay", "#fff")};
`;
const IssueTh = styled(Th)`
  left: 30px;
  z-index: 3;
  background-color: ${token("elevation.surface.overlay", "#f8f8ff")};
`;
const SNoTh = styled(Th)`
  position: sticky;
  position: -webkit-sticky;
  left: 0;
  background-color: ${token("elevation.surface.overlay", "#fffff9")};
  z-index: 3;
`;
export const ReportHeader = ({
  fields,
  selectedFieldIds,
}: Props): JSX.Element => {
  const columnHeads: JSX.Element[] = selectedFieldIds.map((fieldId) => {
    const field = fields.find((field) => field.id === fieldId);
    let { name, id } = field;
    name = toTitleCase(name);
    return (
      <Th key={id}>
        <HeaderCell header={name} />
      </Th>
    );
  });
  columnHeads.unshift(
    <IssueTh key={"issue"}>
      <HeaderCell header="Issue" />
    </IssueTh>
  );
  columnHeads.unshift(
    <SNoTh key={"sno"}>
      <HeaderCell header="#" isSmall />
    </SNoTh>
  );
  return (
    <thead>
      <tr>{columnHeads}</tr>
    </thead>
  );
};
