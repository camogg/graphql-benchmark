import React, { useState } from "react";

import { Typography, Paper, Grid, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	container: {
		width: "80%",
	},
	field: {
		width: "100%",
	},
	button: {
		width: "100%",
		marginTop: 10,
	},
	paper: {
		justifyContent: "center",
		position: "relative",
		flexWrap: "wrap",
		marginTop: theme.spacing(3),
		padding: theme.spacing(2),
		backgroundColor: "transparent",
		border: "1px solid rgba(0, 0, 0, 0.23)",
	},
	paperTitle: {
		marginTop: -27,
		maxWidth: "fit-content",
		background: "white",
		paddingRight: 5,
		paddingLeft: 5,
	},
}));

const GraphQL = (props) => {
	const classes = useStyles();
	const [endpoint, setEndpoint] = useState("");

	const addQuery = (_) => {
		const queryArray = [...props.graphQL];
		queryArray.push({
			endpoint: props.graphQL[0].endpoint,
			query: "",
			iterations: "",
		});
		props.setGraphQL(queryArray);
	};

	const editQuery = (key) => (e) => {
		const queryArray = [...props.graphQL];
		const queryObject = { ...queryArray[key] };
		queryObject[e.target.name] = e.target.value;
		queryArray[key] = queryObject;
		props.setGraphQL(queryArray);
	};

	const editEndpoint = (e) => {
		setEndpoint(e.target.value);
		const queryArray = [...props.graphQL];
		queryArray.forEach((query, key) => {
			const queryObject = { ...query };
			queryObject.endpoint = e.target.value;
			queryArray[key] = queryObject;
		});
		props.setGraphQL(queryArray);
	};

	return (
		<Paper elevation={3} square>
			<Grid
				container
				direction="column"
				justify="center"
				alignItems="center"
				spacing={4}
			>
				<Grid item>
					<Typography variant="h5" align="center">
						GraphQL
					</Typography>
				</Grid>
				<Grid item className={classes.container}>
					<TextField
						className={classes.field}
						size="small"
						variant="filled"
						label="GraphQL Endpoint"
						helperText="Eg. https://yourapi.app/graphql"
						value={endpoint}
						onChange={editEndpoint}
					/>
				</Grid>
				<Grid item className={classes.container}>
					{props.graphQL.map((query, key) => (
						<Paper key={key} className={classes.paper} elevation={0}>
							<Typography className={classes.paperTitle}>
								Query #{key + 1}
							</Typography>
							<TextField
								className={classes.field}
								variant="filled"
								label="Query"
								rows={6}
								size="small"
								multiline
								name="query"
								value={props.graphQL[key].query}
								onChange={editQuery(key)}
							/>
							<TextField
								style={{ marginTop: 10 }}
								size="small"
								variant="filled"
								label="Iterations"
								helperText="Between 1-5 iterations"
								name="iterations"
								value={props.graphQL[key].iterations}
								onChange={editQuery(key)}
								type="number"
							/>
						</Paper>
					))}
					<Button
						className={classes.button}
						variant="outlined"
						onClick={addQuery}
					>
						Add query
					</Button>
				</Grid>
			</Grid>
		</Paper>
	);
};

export default GraphQL;
