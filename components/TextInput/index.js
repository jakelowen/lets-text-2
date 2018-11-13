import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/pro-light-svg-icons';

const StyledSmartInput = styled.div`
  border: 1px solid black;
  display: grid;
  grid-template-columns: 30px 1fr 30px;
  border-color: ${props =>
    props.hasError ? props.theme.colors.danger : props.theme.colors.black};
`;

const StyledInput = styled.input`
  border: 0px;
  width: 100%;
  grid-column: 1/-1;
  grid-row: 1;
  padding: ${props => props.theme.spacing[3]};
  padding-left: ${props => (props.hasIcon ? '40px' : '10px')};
  padding-right: ${props => (props.hasError ? '40px' : '10px')};
`;

const StyledLabel = styled.label`
  grid-column: 1 / -1;
  /* font-size: ${props => props.theme.fontSizes[2]}; */
  font-weight: ${props => props.theme.fontWeight[2]};
`;

const StyledContainer = styled.div`
  display: block;
`;

const FancyIcon = styled.span`
  display: inline;
  grid-column: 1/2;
  grid-row: 1;
  align-self: center;
  justify-self: center;
  z-index: 999;
  color: #ccc;
`;

const ErrorIcon = styled.span`
  grid-column: 3;
  grid-row: 1;
  align-self: center;
  justify-self: center;
  z-index: 999;
  color: ${props => props.theme.colors.danger};
`;

const StyledHelperText = styled.p`
  /* padding: ${props => props.theme.spacing[0]}; */
  font-size: ${props => props.theme.fontSizes[0]};
`;

const StyledErrorText = styled.p`
  font-size: ${props => props.theme.fontSizes[0]};
  color: ${props => props.theme.colors.danger};
`;

const TextInput = ({
  type,
  id,
  label,
  error,
  value,
  onChange,
  help,
  icon,
  ...props
}) => (
  // console.log(error);
  <StyledContainer>
    <StyledLabel htmlFor={id} className="">
      {label}
    </StyledLabel>
    <StyledSmartInput hasError={!!error}>
      {icon && <FancyIcon>{icon}</FancyIcon>}
      <StyledInput
        hasError={!!error}
        hasIcon={!!icon}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        error={error}
        {...props}
      />
      {error && (
        <ErrorIcon>
          <FontAwesomeIcon icon={faExclamationTriangle} />
        </ErrorIcon>
      )}
    </StyledSmartInput>
    {help && <StyledHelperText>{help}</StyledHelperText>}
    {error && <StyledErrorText>{error}</StyledErrorText>}
  </StyledContainer>
);

export default TextInput;
