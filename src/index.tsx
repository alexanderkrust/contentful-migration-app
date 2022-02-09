import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { StrictMode } from 'react';
import { RecoilRoot } from 'recoil';
import reportWebVitals from './reportWebVitals';

import Home from './pages/Home';
import theme from './theme';
import GlobalStyles from './styles';
import { ContentfulSpace } from './state/space';

ReactDOM.render(
  <StrictMode>
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <ContentfulSpace />
        <GlobalStyles />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </RecoilRoot>
  </StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
