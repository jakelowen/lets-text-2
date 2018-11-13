import React, { Component } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Normalize } from 'styled-normalize';
import Header from './Header';
import Meta from './Meta';
// import 'tachyons/css/tachyons.min.css';

export const theme = {
  fontSizes: [
    '.875rem',
    '1rem',
    '1.25rem',
    '1.5rem',
    '2.25rem',
    '3rem',
    '5rem',
    '6rem',
  ],
  fontWeight: [100, 400, 700],
  spacing: ['0', '.25rem', '.5rem', '1rem', '2rem', '4rem', '8rem', '16rem'],
  lineHeight: [1, 1.25, 1.5],
  colors: {
    black: '#393939',
    primary: '#4c84ff',
    danger: '#c0392b',
    white: '#fff',
    background: '#f5f6fa',
    lightGrey: '#e5e6eb',
  },
  borderRadii: ['0', '.125rem', '.25rem', '.5rem', '1rem', '100%', '9999px'],
};

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Roboto:100,400,700');
  
  html {
    box-sizing: border-box;
    /* font-size: 10px; */
  }

  *, *:before, *.after {
    box-sizing: inherit;
  }

  body {
    padding: 0;
    margin: 0;
    font-family: 'Roboto', sans-serif;
    /* font-size: 1.5rem; */
    line-height: 2;
  }

  h1, h2, h3, h4, h5, h6, p {
    margin: 0;
  }
`;

const StyledPage = styled.div`
  background: white;
  color: ${props => props.theme.black};
  display: grid;
`;

class Page extends Component {
  render() {
    const { children } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <StyledPage>
          <Normalize />
          <GlobalStyle />
          <Meta />
          <Header />
          <div>{children}</div>
        </StyledPage>
      </ThemeProvider>
    );
  }
}

export default Page;
