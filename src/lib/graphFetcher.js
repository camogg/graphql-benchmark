import { request } from "graphql-request";

export default async (queries, config) => {
	if (config.executionType === "parallel") {
		const queryPromises = [];
		queries.forEach((query) => {
			for (let index = 0; index < Number.parseInt(query.iterations); index++) {
				queryPromises.push(request(query.endpoint, query.query));
			}
		});
		return Promise.all(queryPromises);
	} else {
		return new Promise((resolve, reject) => {
			queries.forEach(async (query) => {
				for (
					let index = 0;
					index < Number.parseInt(query.iterations);
					index++
				) {
					await request(query.endpoint, query.query);
				}
				resolve();
			});
		});
	}
};
