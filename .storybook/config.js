import { configure, addDecorator } from "@storybook/react";
import React from "react";
import { withNotes } from '@storybook/addon-notes';
import {theme, GlobalStyle} from "../components/Page"
import { ThemeProvider } from 'styled-components'
 
// import 'tachyons/css/tachyons.min.css';


const GlobalStyleDecorator = (storyFn) => (
  <div>
    <ThemeProvider theme={theme}>
      <div>
        <GlobalStyle />
        { storyFn() }
      </div>
    </ThemeProvider>
  </div>
);

addDecorator(GlobalStyleDecorator);

// automatically import all files ending in *.stories.js
const req = require.context("../components/", true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
