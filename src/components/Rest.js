import React from "react";

import randomInt from "../lib/randomInt";

import { Typography, Paper, Grid, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	container: {
		width: "80%",
	},
	field: {
		width: "85%",
	},
	fieldBorder: {
		borderTopLeftRadius: "0px",
	},
	endpointLabel: {
		width: "15%",
		display: "inline-flex",
		lineHeight: "47px",
		justifyContent: "center",
		borderBottom: "1px solid #878787",
		boxSizing: "border-box",
		borderRadius: "4px 0px 0px 0px",
		fontFamily: "Roboto, Arial",
		color: "#4a4a4a",
		backgroundColor: "rgba(0, 0, 0, 0.18)",
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

const Rest = (props) => {
	const classes = useStyles();

	const addQuery = (_) => {
		const queryArray = [...props.rest];
		queryArray.push({
			endpoint: props.rest[0].endpoint,
			iterations: "",
		});
		props.setRest(queryArray);
	};

	const editQuery = (key) => (e) => {
		const queryArray = [...props.rest];
		const queryObject = { ...queryArray[key] };
		queryObject[e.target.name] = e.target.value;
		queryArray[key] = queryObject;
		props.setRest(queryArray);
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
						REST
					</Typography>
				</Grid>
				<Grid item className={classes.container}>
					{props.rest.map((query, key) => (
						<Paper key={key} className={classes.paper} elevation={0}>
							<Typography className={classes.paperTitle}>
								Query #{key + 1}
							</Typography>
							<span className={classes.endpointLabel}>GET</span>
							<TextField
								className={classes.field}
								InputProps={{ classes: { root: classes.fieldBorder } }}
								size="small"
								variant="filled"
								label="Rest Endpoint"
								helperText="Eg. https://yourapi.app/users"
								name="endpoint"
								value={props.rest[key].endpoint}
								onChange={editQuery(key)}
							/>
							<TextField
								style={{ marginTop: 10 }}
								size="small"
								variant="filled"
								label="Iterations"
								helperText={"Eg. " + randomInt(1, 42)}
								name="iterations"
								value={props.rest[key].iterations}
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

export default Rest;
