import React, { useState } from "react";

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

	const start = async (_) => {
		setStatuts("workingRest");
		await restFetcher(rest, config);
		setStatuts("workingGraph");
		await graphFetcher(graphQL, config);
		setStatuts("completed");
	};

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
			</Grid>
		</Container>
	);
}

export default App;
