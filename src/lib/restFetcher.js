export default async (queries, config) => {
	if (config.executionType === "parallel") {
		const queryPromises = [];
		queries.forEach((query) => {
			for (let index = 0; index < Number.parseInt(query.iterations); index++) {
				queryPromises.push(fetch(query.endpoint));
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
					await fetch(query.endpoint);
				}
				resolve();
			});
		});
	}
};
