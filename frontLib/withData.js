import withApollo from 'next-with-apollo';
// import ApolloClient from 'apollo-boost';
import { ApolloClient } from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
// import ws from 'ws';

// import { endpoint, prodEndpoint } from '../config';

// Create an http link:
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

const wsLink = process.browser
  ? new WebSocketLink({
      uri: `ws://localhost:4000/graphql`,
      options: {
        // reconnect: true,
        // connectionParams: {
        //   headers: {
        //     Authorization:
        //       'Bearer BUTTSeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MjViOWRhMi1kNjdmLTQ5ZDItOGU3OS02YTlmZDViM2ViOTYiLCJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsiYWRtaW4iLCJ1c2VyIiwiYW5vbnltb3VzIl0sIngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS11c2VyLWlkIjoiODI1YjlkYTItZDY3Zi00OWQyLThlNzktNmE5ZmQ1YjNlYjk2In0sImlhdCI6MTU0MTkwMTY2NX0.PTpqjlXKVxfyxrgmz6EU1jyKKDCMjq07qzCF7a9AbZo',
        //   },
        // },
      },
    })
  : null;

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = process.browser
  ? split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        // console.log('!!!!! kind, operation', kind, operation);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      wsLink,
      httpLink
    )
  : httpLink;

// import { LOCAL_STATE_QUERY } from '../components/Cart';

function createClient({ headers }) {
  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
    // uri:
    //   process.env.NODE_ENV === 'development'
    //     ? `${endpoint}/graphql`
    //     : `${prodEndpoint}/graphql`,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
        },
        headers,
      });
    },
    // local data
    // clientState: {
    //   resolvers: {
    //     Mutation: {
    //       toggleCart(_, variables, { cache }) {
    //         // read the cartOpen value from the cache
    //         const { cartOpen } = cache.readQuery({
    //           query: LOCAL_STATE_QUERY,
    //         });
    //         // Write the cart State to the opposite
    //         const data = {
    //           data: { cartOpen: !cartOpen },
    //         };
    //         cache.writeData(data);
    //         return data;
    //       },
    //     },
    //   },
    //   defaults: {
    //     cartOpen: false,
    //   },
    // },
  });
}

export default withApollo(createClient);
