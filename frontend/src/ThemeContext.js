// src/ThemeContext.js
// React context for color mode toggling

import React from 'react';

const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

export default ColorModeContext;

