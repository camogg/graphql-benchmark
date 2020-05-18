import React, { useState, useEffect } from "react";

import "typeface-roboto";
import {
	Grid,
	Container,
	Button,
	Paper,
	Typography,
	FormControl,
	FormLabel,
	Radio,
	RadioGroup,
	FormHelperText,
	FormControlLabel,
	CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Header from "./components/Header";
import GraphQL from "./components/GraphQL";
import Rest from "./components/Rest";
import Results from "./components/Results";

import restFetcher from "./lib/restFetcher";
import graphFetcher from "./lib/graphFetcher";

const useStyles = makeStyles((theme) => ({
	container: {
		paddingLeft: theme.spacing(3),
		paddingRight: theme.spacing(3),
	},
}));

function App() {
	const classes = useStyles();
	const [graphQL, setGraphQL] = useState([
		{ endpoint: "", query: "", iterations: "" },
	]);
	const [rest, setRest] = useState([{ endpoint: "", iterations: "" }]);
	const [config, setConfig] = useState({
		executionType: "sequential",
	});
	const [status, setStatuts] = useState("waiting");
	const [graphTime, setGraphTime] = useState(0);
	const [restTime, setRestTime] = useState(0);
	const [graphSize, setGraphSize] = useState(0);
	const [restSize, setRestSize] = useState(0);
	const [results, setResults] = useState([]);

	const start = async (_) => {
		setStatuts("workingRest");
		const rest0 = window.performance.now();
		await restFetcher(rest, config, setRestSize);
		const rest1 = window.performance.now();

		setStatuts("workingGraph");
		const graph0 = window.performance.now();
		await graphFetcher(graphQL, config, setGraphSize);
		const graph1 = window.performance.now();

		setGraphTime(graph1 - graph0);
		setRestTime(rest1 - rest0);
		setStatuts("completed");
	};

	const resetResults = (_) => {
		setGraphSize(0);
		setGraphTime(0);
		setRestSize(0);
		setRestTime(0);
	};

	useEffect(
		(_) => {
			if (
				graphTime !== 0 &&
				graphSize !== 0 &&
				restTime !== 0 &&
				restSize !== 0
			) {
				const resultsCopy = [...results];
				resultsCopy.push({
					graphTime: graphTime,
					graphSize: graphSize,
					restTime: restTime,
					restSize: restSize,
					time: new Date(),
				});
				setResults(resultsCopy);
				resetResults();
			}
		},
		[graphSize, graphTime, restSize, restTime, results]
	);

	return (
		<Container>
			<Grid container justify="center" spacing={6}>
				<Grid item xs={12}>
					<Header />
				</Grid>
				<Grid item xs={6}>
					<Rest rest={rest} setRest={setRest} />
				</Grid>
				<Grid item xs={6}>
					<GraphQL graphQL={graphQL} setGraphQL={setGraphQL} />
				</Grid>
				<Grid item xs={12}>
					<Paper elevation={3} square>
						<Grid
							container
							direction="column"
							justify="center"
							spacing={4}
							className={classes.container}
						>
							<Grid item>
								<Typography variant="h5">Options</Typography>
							</Grid>
							<Grid item xs={12}>
								<FormControl component="fieldset">
									<FormLabel component="legend">Execution order</FormLabel>
									<RadioGroup
										name="executionType"
										value={config.executionType}
										onChange={(e) =>
											setConfig({ ...config, executionType: e.target.value })
										}
										row
									>
										<FormControlLabel
											value="sequential"
											control={<Radio color="primary" />}
											label="Sequential"
										/>
										<FormControlLabel
											value="parallel"
											control={<Radio color="primary" />}
											label="Parallel"
										/>
									</RadioGroup>
									<FormHelperText>
										Execution can be sequential (one query at a time) or in
										parallel
									</FormHelperText>
								</FormControl>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
				<Grid item>
					<div style={{ position: "relative" }}>
						<Button
							variant="contained"
							size="large"
							onClick={start}
							disabled={
								status === "workingRest" || status === "workingGraph"
									? true
									: false
							}
						>
							Start
						</Button>
						{(status === "workingRest" || status === "workingGraph") && (
							<CircularProgress
								style={{
									position: "absolute",
									left: "50%",
									top: "50%",
									marginLeft: -12,
									marginTop: -12,
								}}
								size={24}
							/>
						)}
					</div>
				</Grid>
				<Results results={results} />
			</Grid>
		</Container>
	);
}

export default App;
