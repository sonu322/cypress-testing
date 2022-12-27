import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";
import { LinkTypeRow } from "./LinkTypeRow";
import { ReportHeader } from "./ReportHeader";
import {
  IssueField,
  IssueLinkType,
  IssueType,
  IssueWithSortedLinks,
} from "../../types/api";
import { IssueTypeRow } from "./IssueTypeRow";
import { getScreenHeight } from "../../util/common";
import { IssueTreeMultiNode } from "../IssueTreeModule/IssueTreeMultiNode";
import { APIContext } from "../../context/api";
import TreeUtils from "../../util/TreeUtils";

const DEFAULT_FILTER = { priorities: [], issueTypes: [], linkTypes: [] };
const Container = styled.div`
  width: 100%;
  overflow: scroll;
  border: 1px solid ${colors.N40};
  border-radius: 10px;
`;
const BorderTr = styled.tr`
  border-bottom: 1px solid ${colors.N40};
  &:hover {
    background-color: #091e420a;
  }
`;
const Table = styled.table`
  border: 1px solid ${colors.N40};
`;
interface Props {
  filteredIssues: IssueWithSortedLinks[];
  tableFields: IssueType[] | IssueLinkType[];
  selectedTableFieldIds: string[];
  issueFieldIds: string[];
  isIssueTypeReport: boolean;
  errors: any[];
  issueFields: IssueField[];
}
export const TreeReport = ({
  filteredIssues,
  tableFields,
  selectedTableFieldIds,
  issueFieldIds,
  issueFields,
  isIssueTypeReport,
  errors,
}: Props): JSX.Element => {
  // TODO: probably we may improve this calculation
  const calculateTableHeight = (errors) => {
    const headingHeight = 40 + 8; // 8: margin top
    const toolbarHeight = 94 + 8; // 8: table top margin
    const footerHeight = 32 + 8 + 8;
    const // more button 8: margin top and bottom
      errorsHeight = errors && errors.length ? (52 + 8) * errors.length : 0;
    const finalHeight =
      getScreenHeight() -
      headingHeight -
      toolbarHeight -
      footerHeight -
      errorsHeight -
      2;
    return finalHeight < 200 ? 200 : finalHeight;
  };
  const api = useContext(APIContext);
  const treeUtils = new TreeUtils(api);

  const [tableHeight, setTableHeight] = useState(calculateTableHeight(errors));
  const [tree, setTree] = useState(treeUtils.getRootTree());
  // const [issueFields, setIssueFields] = useState<IssueField[]>([]);
  useEffect(() => {
    const resizeHandler = () => {
      setTableHeight((prevHeight) => {
        // @ts-expect-error
        AP.sizeToParent();
        return calculateTableHeight(errors);
      });
    };
    window.addEventListener("resize", resizeHandler);
    resizeHandler();
    return () => window.removeEventListener("resize", resizeHandler);
  }, [errors]);

  // useEffect(() => {
  //   const fetchFields = async (): Promise<void> => {
  //     try {
  //       const fields = await api.getIssueFields();
  //       setIssueFields(fields);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   void fetchFields();
  // }, []);
  console.log(tree);
  return (
    <Container style={{ maxHeight: tableHeight }}>
      <IssueTreeMultiNode
        tree={tree}
        setTree={setTree}
        filter={DEFAULT_FILTER}
        treeUtils={treeUtils}
        issueFields={issueFields}
        selectedIssueFieldIds={issueFieldIds}
        handleError={() => {}}
        clearAllErrors={() => {}}
        filteredIssues={filteredIssues}
      />
    </Container>
  );
};
