import { colors } from "@atlaskit/theme";
import React from "react";
import styled from "styled-components";
import { IssueField } from "../../types/api";
import { toTitleCase } from "../../util";
import { HeaderCell } from "./HeaderCell";

interface Props {
  fields: IssueField[];
  fieldIds: string[];
}

const Th = styled.th`
  border: 1px solid ${colors.N40};
`;
export const ReportHeader = ({ fields, fieldIds }: Props): JSX.Element => {
  const columnHeads: JSX.Element[] = fieldIds.map((fieldId) => {
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
    <Th key={"issue"}>
      <HeaderCell header="Issue" />
    </Th>
  );
  columnHeads.unshift(
    <Th key={"sno"}>
      <HeaderCell header="#" isSmall />
    </Th>
  );
  return (
    <thead>
      <tr>{columnHeads}</tr>
    </thead>
  );
};
