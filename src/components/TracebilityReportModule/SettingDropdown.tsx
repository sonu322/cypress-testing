import React from "react";
import SettingsIcon from '@atlaskit/icon/glyph/settings'
import { Dropdown } from "../common/Dropdown";
import { IssueType, IssueLinkType } from "../../types/api";

interface Props {
    options: IssueType[];
    selectedOptions: string[];
    updateSelectedOptionIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export const SettingsDropdown = ({
    options,
    selectedOptions,
    updateSelectedOptionIds,
}: Props): JSX.Element => {
    return (
        <Dropdown
            dropdownName={<SettingsIcon/>}
            useTitleCaseOptions 
            options={options}
            selectedOptions={selectedOptions}
            updateSelectedOptions={updateSelectedOptionIds}
        />
    );
};

