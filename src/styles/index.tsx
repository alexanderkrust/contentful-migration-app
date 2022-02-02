import { css, Global } from '@emotion/react';

const globalCss = css`
  html,
  body {
    background-color: var(--chakra-colors-gray-100);
  }
`;

function GlobalStyles() {
  return <Global styles={globalCss} />;
}

export default GlobalStyles;
