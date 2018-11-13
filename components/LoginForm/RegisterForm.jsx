import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope } from '@fortawesome/pro-light-svg-icons';
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
    /* grid-auto-flow: column; */

    div {
      grid-column-start: 1;
    }

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

const RegisterForm = ({ mutation, updateParentState, email }) => (
  <Styles>
    <Formik
      initialValues={{ email: email === null ? '' : email, name: '' }}
      enableReinitialize
      validationSchema={Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string()
          .email('Must be a properly formatted email address')
          .required('Email is required'),
      })}
      onSubmit={(
        values,
        { setSubmitting /*  setErrors setValues and other goodies */ }
      ) => {
        setSubmitting(true);
        mutation({
          variables: { email: values.email, name: values.name },
        }).then(response => {
          updateParentState(
            'securityCode',
            response.data.register.securityCode
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
      }) => (
        <Form>
          <StyledHeadline>Let's get you registered</StyledHeadline>

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
          <TextInput
            id="name"
            type="text"
            label="Name"
            placeholder="Your name.."
            error={errors.name && touched.name && errors.name}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            icon={<FontAwesomeIcon icon={faUser} />}
          />

          <FormSubmitButton
            disabled={isSubmitting}
            value="Register new account"
          />
        </Form>
      )}
    />
  </Styles>
);

RegisterForm.propTypes = {
  email: PropTypes.string,
  mutation: PropTypes.func.isRequired,
  updateParentState: PropTypes.func.isRequired,
};

export default RegisterForm;
