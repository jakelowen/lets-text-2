/* eslint-disable */
import React from 'react';
import { storiesOf } from '@storybook/react';
import InboxItem from '.';
import { withNotes } from '@storybook/addon-notes';


storiesOf('InboxItem', module)
  .add('default',  withNotes('A very simple component')(() => (
    <div style={{ width: '80%', margin: '10px auto 10px auto' }}>
      <InboxItem body="This is truncated message" responseRating={4} numMessages={3} timestamp={1541604014}/>
    </div>
  )))
  
