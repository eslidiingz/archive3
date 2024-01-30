import Config from "../../configs/config";

const baseUri = Config.SUBGRAPH_URI;

const gqlQuery = async (_query, _variables) => {
  const _body = JSON.stringify({
    query: `query MyQuery { ${_query} }`,
    variables: _variables,
  });

  const res = await fetch(baseUri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: _body,
  });

  return await res.json();
};

export const getSubgraph = async (_query) => {
  return await gqlQuery(_query);
};
