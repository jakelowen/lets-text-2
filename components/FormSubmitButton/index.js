import React from 'react';
// import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: ${props => props.theme.spacing[3]};
  color: ${props => (props.disabled ? '#ccc' : props.theme.colors.primary)};
  font-size: ${props => props.theme.fontSizes[1]};
  border-width: 1px;
  border-color: ${props =>
    !props.disabled ? props.theme.colors.primary : `#ccc`};
  border-radius: ${props => props.theme.borderRadii[3]};
  background-color: ${props => props.theme.colors.white};
  &:hover {
    background-color: ${props =>
      !props.disabled ? props.theme.colors.primary : null};
    color: ${props => (!props.disabled ? props.theme.colors.white : null)};
  }
`;

const FormSubmitButton = ({ isSubmitting, disabled, value }) => (
  <StyledButton disabled={disabled} type="submit">
    {!isSubmitting ? value : <FontAwesomeIcon icon={faSpinner} spin />}
  </StyledButton>
);

FormSubmitButton.propTypes = {
  isSubmitting: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.string.isRequired,
};

FormSubmitButton.defaultProps = {
  isSubmitting: false,
};

export default FormSubmitButton;
