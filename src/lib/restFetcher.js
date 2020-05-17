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
					queryPromises.push(fetch(query.endpoint));
				}
			});
			const responses = await Promise.all(queryPromises);
			const formatPromises = [];
			responses.forEach((response) => formatPromises.push(response.json()));
			const datas = await Promise.all(formatPromises);
			datas.forEach((data) => (responseSize += sizeof(data)));
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
					const response = await fetch(query.endpoint);
					responseSize += sizeof(await response.json());
				}
			}
			resolve();
			setSize(responseSize);
		});
	}
};
