import React from "react";
import { IssueField } from "../../types/api";
import { toTitleCase } from "../../util";
import { HeaderCell } from "./HeaderCell";

interface Props {
  fields: IssueField[];
  fieldIds: string[];
}
export const ReportHeader = ({ fields, fieldIds }: Props): JSX.Element => {
  const columnHeads: JSX.Element[] = fieldIds.map((fieldId) => {
    const field = fields.find((field) => field.id === fieldId);
    let { name, id } = field;
    name = toTitleCase(name);
    return (
      <th key={id}>
        <HeaderCell header={name} />
      </th>
    );
  });
  columnHeads.unshift(
    <th key={"issue"}>
      <HeaderCell header="Issue" />
    </th>
  );
  columnHeads.unshift(
    <th key={"sno"}>
      <HeaderCell header="#" isSmall />
    </th>
  );
  return (
    <thead>
      <tr>{columnHeads}</tr>
    </thead>
  );
};
