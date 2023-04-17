// import React from "react";
// import Button from "@atlaskit/button";
// import { LinkIssueDialog } from "./LinkIssueDialog";

// interface Props {}

// export const LinkIssueButton = () => {
//   //   return <Button onClick={() => console.log("Link Issue")}>Link Issue</Button>;

//   return (
//     <>
//       <Button onClick={() => console.log("Link Issue")}>Link Issue</Button>;
//       <LinkIssueDialog
//         onClose={() => console.log("Close")}
//         onConfirm={() => console.log("Confirm")}
//         isDialogOpen={true}
//       />
//     </>
//   );
// };

import React, { useState } from "react";
import Button from "@atlaskit/button";
import { LinkIssueDialog } from "./LinkIssueDialog";

interface Props {}

export const LinkIssueButton = ({}: Props): JSX.Element => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <Button onClick={handleOpenDialog}>Link Issue</Button>
      {isDialogOpen && (
        <LinkIssueDialog onClose={() => setIsDialogOpen(false)} />
      )}
    </>
  );
};
