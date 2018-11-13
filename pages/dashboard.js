import gql from 'graphql-tag';
import { Query, Subscription } from 'react-apollo';
import PleaseSignIn from '../components/PleaseSignIn';
import NavBar from '../components/NavBar/connected';

const INBOX_QUERY = gql`
  query {
    inbox {
      patron {
        id
      }
      body
      oldest_message_in_thread
      count
    }
  }
`;

const INBOX_SUBSCRIPTION = gql`
  subscription {
    inbox {
      patron {
        id
      }
      body
      oldest_message_in_thread
      count
    }
  }
`;

const dashboard = () => (
  <>
    <PleaseSignIn>
      <NavBar />
      <p>Dashboard stuff</p>
      <p>below stuff is temp scratchpad</p>

      <Subscription subscription={INBOX_SUBSCRIPTION}>
        {({ data, loading }) => <pre>{JSON.stringify(data, null, '\t')}</pre>}
      </Subscription>
    </PleaseSignIn>
  </>
);

export default dashboard;

{
  /* <Query query={INBOX_QUERY}>
        {result => {
          console.log(result);
          return <pre>{JSON.stringify(result.data, null, '\t')}</pre>;
        }}
      </Query> */
}
