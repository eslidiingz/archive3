const gqlQuery = async (_query, _variables) => {
  const _body = JSON.stringify({ query: _query, variables: _variables });

  const res = await fetch(`https://subgraph.velaverse.io/api/v1/gql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: _body,
  });

  return await res.json();
};

const _qStr = (_conditions) => {
  return `query {
    eve_log2 (${_conditions}) {
      sm_addr
      own_addr
      token_id
      type
      x
      y
    }
  }`;
};

export const getEventLogs = async (_address) => {
  const { eve_log2 } = await gqlQuery(
    _qStr(`where: {sm_addr: {_eq: "${_address}"}}`)
  );

  return eve_log2;
};

export const getLandsByOwner = async (_address, _owner) => {
  const { eve_log2 } = await gqlQuery(
    _qStr(
      `where: {sm_addr: {_eq: "${_address}"}, own_addr: {_eq: "${_owner}"}}`
    )
  );

  return eve_log2;
};

export const landJsonDataToObjectArray = (_string, _type, _owner) => {
  const str = _string;
  str = str.replace(` ${_type}`, "");
  str = str.replace(` ${_owner}`, "");
  str = str.substr(2);
  str = str.slice(0, -2);
  str = str.split(`] [`);

  return {
    _xArray: str[0].split(" "),
    _yArray: str[1].split(" "),
  };
};
