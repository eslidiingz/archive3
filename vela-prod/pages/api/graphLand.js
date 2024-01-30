import Cors from "cors";

const cors = Cors({
  methods: ["GET", "HEAD"],
});

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
    eve_log (${_conditions}) {
      address
      json_data
      owner_address
      tokenId
      type
    }
  }`;
};

const getLands = async (_address) => {
  const { eve_log } = await gqlQuery(
    _qStr(`where: {address: {_eq: "${_address}"}}`)
  );

  return eve_log;
};

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

async function handler(req, res) {
  // Run the middleware
  await runMiddleware(req, res, cors);

  const query = req.query;
  if (query.method === "getLands") {
    return res.status(200).json(await getLands(query.address));
  } else {
    return res.status(404);
  }
}

export default handler;

// export default async function getData(req, res) {
//   const query = req.query;

//   console.log(req.query);

//   if (query.method === "getLands") {
//     return res.status(200).json(await getLands(query.address));
//   } else {
//     return res.status(404);
//   }
// }
