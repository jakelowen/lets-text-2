import React from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';

const InboxItemContainer = styled.div`
  display: grid;
  border: 1px solid ${props => props.theme.colors.lightGrey};
  background-color: ${props =>
    props.active ? props.theme.colors.white : props.theme.colors.background};
  padding: ${props => props.theme.spacing[3]};
`;

const Badge = styled.span`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 50%;
  padding: ${props => props.theme.spacing[1]};
  line-height: 2rem;
  min-width: 3rem;
  margin-left: 1rem;
  font-weight: 100;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
  justify-self: start;
`;

const InboxItem = ({
  body,
  responseRating,
  numMessages,
  timestamp,
  active,
}) => (
  <InboxItemContainer active={active}>
    <div>
      {body} - <Badge>{numMessages}</Badge>
    </div>
    <p>{timestamp}</p>
  </InboxItemContainer>
);

// InboxItem.propTypes = {
//   body: PropTypes.string.isRequired(),
//   responseRating: PropTypes.number.isRequired(),
//   numMessages: PropTypes.number.isRequired(),
// };

export default InboxItem;
