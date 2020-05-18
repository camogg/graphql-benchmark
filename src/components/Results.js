import React from "react";

import moment from "moment";
import numeral from "numeral";

import { Grid, Typography, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	container: {
		paddingLeft: theme.spacing(3),
		paddingRight: theme.spacing(3),
	},
	bar: {
		height: 15,
		borderRadius: 15,
	},
	title: {
		fontSize: "1rem",
	},
}));

export default (props) => {
	const { results } = props;
	const classes = useStyles();

	const bar = (size, color) => (
		<div
			className={classes.bar}
			style={{ width: size + "%", backgroundColor: color }}
		/>
	);

	const displayResult = (value, unit, label, color, topRange) => (
		<Grid container justify="center" alignItems="center" spacing={4}>
			<Grid item xs={2}>
				<Typography>{label}</Typography>
				<Typography style={{ fontWeight: "bold" }}>
					{unit === "B"
						? numeral(value).format("0.00b")
						: numeral(value).format("0") + " " + unit}
				</Typography>
			</Grid>
			<Grid item xs={9}>
				{bar((value / topRange) * 100, color)}
			</Grid>
		</Grid>
	);

	return (
		<>
			<Grid item xs={12}>
				<Typography variant="h5">Results</Typography>
			</Grid>
			{results.length === 0 ? (
				<Grid item>
					<Typography variant="body1" color="textSecondary">
						No results to show
					</Typography>
				</Grid>
			) : (
				results
					.sort((a, b) => (a.time - b.time) * -1)
					.map((result, key) => (
						<Grid key={key} item xs={12}>
							<Paper elevation={3} square>
								<Grid
									container
									direction="column"
									justify="center"
									spacing={4}
									className={classes.container}
								>
									<Grid item>
										<Typography variant="h6">
											Result #{key + 1} -{" "}
											{moment(result.time).format("YYYY-MM-DD, H:mm:ss Z")}
										</Typography>
									</Grid>
									<Grid item xs={12} style={{ maxHeight: 230 }}>
										<Grid container>
											<Grid item xs={6}>
												<Typography
													variant="overline"
													component="p"
													align="center"
													className={classes.title}
												>
													Execution Time
												</Typography>
												{displayResult(
													result.graphTime,
													"ms",
													"GraphQL",
													"#4fc3f7",
													result.graphTime > result.restTime
														? result.graphTime
														: result.restTime
												)}
												{displayResult(
													result.restTime,
													"ms",
													"REST",
													"#01579b",
													result.graphTime > result.restTime
														? result.graphTime
														: result.restTime
												)}
												<Typography
													variant="overline"
													component="p"
													align="center"
												>
													(Lower is better)
												</Typography>
											</Grid>
											<Grid item xs={6}>
												<Typography
													variant="overline"
													component="p"
													align="center"
													className={classes.title}
												>
													Response Size
												</Typography>
												{displayResult(
													result.graphSize,
													"B",
													"GraphQL",
													"#4dd0e1",
													result.graphSize > result.restSize
														? result.graphSize
														: result.restSize
												)}
												{displayResult(
													result.restSize,
													"B",
													"REST",
													"#006064",
													result.graphSize > result.restSize
														? result.graphSize
														: result.restSize
												)}
												<Typography
													variant="overline"
													component="p"
													align="center"
												>
													(Lower is better)
												</Typography>
											</Grid>
										</Grid>
									</Grid>
									<Grid item>
										<Typography align="center">
											{result.graphTime > result.restTime ? "REST" : "GraphQL"}{" "}
											was{" "}
											<b>
												{result.graphTime > result.restTime
													? numeral(
															1 - result.restTime / result.graphTime
													  ).format("0%")
													: numeral(
															1 - result.graphTime / result.restTime
													  ).format("0%")}
											</b>{" "}
											faster than{" "}
											{result.graphTime < result.restTime ? "REST" : "GraphQL"}{" "}
											while{" "}
											{result.graphSize > result.restSize ? "REST" : "GraphQL"}
											's response is{" "}
											<b>
												{result.graphSize > result.restSize
													? numeral(
															1 - result.restSize / result.graphSize
													  ).format("0%")
													: numeral(
															1 - result.graphSize / result.restSize
													  ).format("0%")}
											</b>{" "}
											lighter than{" "}
											{result.graphSize < result.restSize ? "REST" : "GraphQL"}.
										</Typography>
									</Grid>
								</Grid>
							</Paper>
						</Grid>
					))
			)}
		</>
	);
};
