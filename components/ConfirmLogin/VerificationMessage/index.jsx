import React from 'react';
import styled from 'styled-components';
import Loading from '../../Loading';
import GenericError from '../../GenericError';

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
`;

export default class VerificationMessage extends React.Component {
  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    const { submitToConnector } = this.props;
    submitToConnector();
  }

  render() {
    // eslint-disable-next-line react/prop-types
    const { loading, error, data, called } = this.props;
    if (loading || !called) {
      return <Loading />;
    }
    // console.log(confirmLogin);

    if (error) {
      return <GenericError />;
    }

    // console.log('!!!data', data);
    // const { confirmLogin } = data;
    // return <p>stalling...</p>;

    return (
      <Styled>
        <h1>{data && data.confirmLogin.success ? 'Success!' : 'Dang!'}</h1>
        <p>{data && data.confirmLogin.message}</p>
      </Styled>
    );
  }
}
