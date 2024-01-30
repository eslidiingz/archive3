import Config from "/configs/config";

const baseUri = Config.GQL_URI;

const gqlQuery = async (_query, _variables) => {
	const _body = JSON.stringify({
		query: `query MyQuery { ${_query} }`,
		variables: _variables,
	});

	console.log("baseUri ",baseUri)

	const res = await fetch(baseUri, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: _body,
	});

	return await res.json();
};

export const getGql = async (_query) => {
	return await gqlQuery(_query);
};
