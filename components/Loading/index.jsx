import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import styled from 'styled-components';

const Styles = styled.div`
  svg {
    margin-right: ${props => props.theme.spacing[2]};
  }

  p {
    display: inline-block;
    font-size: ${props => props.theme.fontSizes[2]};
  }
`;

const Loading = () => (
  <Styles>
    <FontAwesomeIcon icon={faSpinner} spin />
    <p>Loading...</p>
  </Styles>
);

export default Loading;
