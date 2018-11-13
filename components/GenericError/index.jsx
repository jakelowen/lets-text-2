import React from 'react';
import styled from 'styled-components';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSpinner } from "@fortawesome/pro-light-svg-icons";

const Styled = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: minmax(auto, 1fr) 1fr minmax(auto, 1fr);

  h1 {
    font-size: ${props => props.theme.fontSizes[5]};
    font-weight: ${props => props.theme.fontWeight[0]};
    line-height: ${props => props.theme.lineHeight[1]};
    grid-column-start: 2;
  }

  p {
    font-size: ${props => props.theme.fontSizes[1]};
    grid-column-start: 2;
    /* font-weight: ${props => props.theme.fontWeight[0]}; */
    /* line-height: ${props => props.theme.lineHeight[1]}; */
  }
`;

const Loading = () => (
  <Styled>
    <h1>Dang.</h1>
    <p>Something went wrong. Try again later.</p>
  </Styled>
);

export default Loading;
