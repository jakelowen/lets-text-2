import withApollo from 'next-with-apollo';
import { ApolloClient } from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';

// Create an http link: - uses defaults
const httpLink = new HttpLink();

// subscriptions uses constructed relative link
const wsLink = process.browser
  ? new WebSocketLink({
      uri: `ws://${window.location.host}/graphql`, // `ws://localhost:4000/graphql`, // replace with ENV
      options: {
        reconnect: true,
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
