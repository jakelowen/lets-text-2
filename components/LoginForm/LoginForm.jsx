import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/pro-light-svg-icons';
import TextInput from '../TextInput';
import FormSubmitButton from '../FormSubmitButton';

const Styles = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  /* grid-template-areas: '. content .'; */

  form {
    margin-top: ${props => props.theme.spacing[7]};
    grid-column: 2/-2;
    height: 100vh;
    align-content: start;
    display: grid;
    grid-template-columns: 1fr;
    /* grid-template-columns: max-content 1fr; */
    grid-gap: ${props => props.theme.spacing[3]};

    button {
      display: inline-block;
      grid-column-start: 1;
      justify-self: start;
    }
  }
`;

const StyledHeadline = styled.h2`
  font-size: ${props => props.theme.fontSizes[5]};
  font-weight: ${props => props.theme.fontWeight[0]};
  line-height: ${props => props.theme.lineHeight[1]};
  grid-column-start: span 2;
`;

const LoginForm = ({ mutation, updateParentState }) => (
  <Styles>
    <Formik
      initialValues={{ email: '' }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email('Must be a properly formatted email address')
          .required('Email is required'),
      })}
      onSubmit={(
        values,
        { setSubmitting /*  setErrors setValues and other goodies */ }
      ) => {
        // setParentState("registrantEmail", values.email);
        setSubmitting(true);
        mutation({
          variables: { email: values.email },
        }).then(response => {
          updateParentState(
            'securityCode',
            response.data.requestLogin.securityCode
          );
          updateParentState('email', values.email);
        });
      }}
      render={({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting,
        isValid,
      }) => (
        <Form>
          <StyledHeadline>Sign in</StyledHeadline>
          <TextInput
            id="email"
            type="text"
            label="Email"
            placeholder="Your email.."
            error={errors.email && touched.email && errors.email}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            icon={<FontAwesomeIcon icon={faEnvelope} />}
          />
          <FormSubmitButton
            disabled={isSubmitting || !isValid}
            isSubmitting={isSubmitting}
            value="Sign in"
          />
        </Form>
      )}
    />
  </Styles>
);

LoginForm.propTypes = {
  mutation: PropTypes.func.isRequired,
  updateParentState: PropTypes.func.isRequired,
};

export default LoginForm;
