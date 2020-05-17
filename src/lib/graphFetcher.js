import { request } from "graphql-request";
import sizeof from "object-sizeof";

export default async (queries, config, setSize) => {
	let responseSize = 0;
	if (config.executionType === "parallel") {
		return new Promise(async (resolve, reject) => {
			const queryPromises = [];
			queries.forEach((query) => {
				for (
					let index = 0;
					index < Number.parseInt(query.iterations);
					index++
				) {
					queryPromises.push(request(query.endpoint, query.query));
				}
			});
			const responses = await Promise.all(queryPromises);
			responses.forEach((data) => (responseSize += sizeof(data)));
			setSize(responseSize);
			resolve();
		});
	} else {
		return new Promise(async (resolve, reject) => {
			for (let queryIndex = 0; queryIndex < queries.length; queryIndex++) {
				const query = queries[queryIndex];
				for (
					let index = 0;
					index < Number.parseInt(query.iterations);
					index++
				) {
					const response = await request(query.endpoint, query.query);
					responseSize += sizeof(response);
				}
			}
			resolve();
			setSize(responseSize);
		});
	}
};
