export const grapqhlEndpoint = `http://${process.env.DOMAIN}:${process.env.PORT}${
    process.env.GRAPHQL_PATH
  }`
  
export const subscriptionEndpoint = `ws://${process.env.DOMAIN}:${process.env.PORT}${
    process.env.GRAPHQL_PATH
  }`