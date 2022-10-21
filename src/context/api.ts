import React from 'react';
import UnknownImpl from '../impl/Unknown';
const api = new UnknownImpl();
export const APIContext = React.createContext(api);