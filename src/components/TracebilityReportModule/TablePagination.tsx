import React from "react";
import AtlasPagination from "@atlaskit/pagination";
interface Props {
  totalNumberOfIssues: number;
  issuePerPage: number;
  currentPage: number;
  updateCurrentPage: (page: number) => void;
}

export const TablePagination = ({
  totalNumberOfIssues,
  issuePerPage,
  currentPage,
  updateCurrentPage,
}: Props): JSX.Element => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalNumberOfIssues / issuePerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <div>
      <AtlasPagination
        selectedIndex={currentPage - 1}
        pages={pageNumbers}
        onChange={(e, page) => {
          console.log(e, page);
          updateCurrentPage(page);
        }}
      ></AtlasPagination>
    </div>
  );
};
