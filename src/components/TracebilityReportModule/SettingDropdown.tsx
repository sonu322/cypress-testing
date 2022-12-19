import React from "react";
import SettingsIcon from '@atlaskit/icon/glyph/settings'
import { Dropdown } from "../common/Dropdown";

export interface CellLimit {
    id: string;
    name: string;
}
interface Props {
    options: CellLimit[];
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
            options={options}
            selectedOptions={selectedOptions}
            updateSelectedOptions={updateSelectedOptionIds}
        />
    );
};

