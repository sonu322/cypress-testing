import React from "react";
import Button from "@atlaskit/button";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface Props {
  refresh: () => void;
}
export const RefreshButton = ({ refresh }: Props): JSX.Element => {
  return (
    <Button onClick={refresh}>
      <FontAwesomeIcon icon={faRefresh} />
    </Button>
  );
};
