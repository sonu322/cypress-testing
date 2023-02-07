import React from "react";
import AtlasPagination from "@atlaskit/pagination";
export interface props {
  totalNumberOfIssues: any;
}

export const TablePagination = ({
  totalNumberOfIssues,
  issuePerPage,
  currentPage,
  updateCurrentPage,
}) => {
  // const issuePerPage = 20;
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
