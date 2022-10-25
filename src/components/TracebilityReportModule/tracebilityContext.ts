import { createContext } from "react";

const defaultContext = {
    selectedFilterId: null,
    setSelectedFilterId: () => {}
}
export const TracebilityContext = createContext<TracebilityContext>(defaultContext)