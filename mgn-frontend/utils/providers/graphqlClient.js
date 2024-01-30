import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client"
import Config from "../../configs/config"

const gqlClient = new ApolloClient({
  link: new HttpLink({
    uri: Config.HASURA_CONNECTION_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Cache-Control": "no-cache",
      "x-hasura-admin-secret": Config.HASURA_SECRET_KEY,
    },
  }),
  cache: new InMemoryCache(),
})

export { gqlClient }
