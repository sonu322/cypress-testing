import React, { useState } from "react";
import Button from "@atlaskit/button";
import { LinkIssueDialog } from "./LinkIssueDialog";

interface Props {
  autoRefresh: () => void;
}

export const LinkIssueButton = ({ autoRefresh }: Props): JSX.Element => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <Button onClick={handleOpenDialog}>Link Issue</Button>
      {isDialogOpen && (
        <LinkIssueDialog
          onClose={() => setIsDialogOpen(false)}
          autoRefresh={autoRefresh}
        />
      )}
    </>
  );
};
