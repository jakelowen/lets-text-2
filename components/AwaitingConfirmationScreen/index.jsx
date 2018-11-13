import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import styled from 'styled-components';

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
  }

  svg {
    margin-right: ${props => props.theme.spacing[2]};
  }
`;

const StyledSecurityCode = styled.p`
  background-color: ${props => props.theme.colors.black};
  color: ${props => props.theme.colors.white};
  display: inline-block;
  padding: ${props => props.theme.spacing[3]};
`;

const AwaitingConfirmation = ({ email, securityCode }) => (
  <Styled>
    <h1>Awaiting Verification</h1>
    <p>
      We have sent an email to <strong>{email}</strong>
    </p>
    <p>
      Please login to your email and verify the provided security code matches
      the following text:
    </p>
    <p>Your security code:</p>
    <StyledSecurityCode>{securityCode}</StyledSecurityCode>
    <p>
      <FontAwesomeIcon icon={faSpinner} spin />
      Waiting for confirmation...
    </p>
  </Styled>
);

AwaitingConfirmation.propTypes = {
  email: PropTypes.string.isRequired,
  securityCode: PropTypes.string.isRequired,
};

export default AwaitingConfirmation;
