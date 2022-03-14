const cssVar = (variableName: string, theme: 'night' | 'day'): string => {
  return `var(--${theme}-${variableName})`;
};

export default cssVar;
