import express from "express";
import db from "./db.js";
import bodyParser from "body-parser";

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/api/v1/vehicles", (req, res) => {
	res.status(200).send({
		success: "true",
		message: "Vehicles retrieved successfully",
		vehicles: db
	});
});

app.get("/api/v1/vehicles/:id", (req, res) => {
	let vehicleFound = false;
	const id = parseInt(req.params.id, 10);
	db.map(vehicles => {
		if (vehicles.id === id) {
			vehicleFound = true;
			return res.status(200).send({
				success: "true",
				message: "Vehicle retrieved successfully",
				vehicles
			});
		}
	});
	if (!vehicleFound) {
		return res.status(404).send({
			success: "false",
			message: "Vehicle does not exist"
		});
	}
});

app.post("/api/v1/vehicles", (req, res) => {
	if (!req.body.year) {
		return res.status(400).send({
			success: "false",
			message: "Year is required"
		});
	} else if (!req.body.make) {
		return res.status(400).send({
			success: "false",
			message: "Make is required"
		});
	} else if (!req.body.model) {
		return res.status(400).send({
			success: "false",
			message: "Model is required"
		});
	}
	const vehicles = {
		id: db.length + 1,
		year: req.body.year,
		make: req.body.make,
		model: req.body.model
	};
	db.push(vehicles);
	return res.status(201).send({
		success: "true",
		message: "Vehicle added successfully",
		vehicles
	});
});

app.delete("/api/v1/vehicles/:id", (req, res) => {
	let vehicleFound = false;
	const id = parseInt(req.params.id, 10);

	db.map((vehicles, index) => {
		if (vehicles.id === id) {
			vehicleFound = true;
			db.splice(index, 1);
			return res.status(200).send({
				success: "true",
				message: "Vehicle deleted successfuly"
			});
		}
	});
	if (!vehicleFound) {
		return res.status(404).send({
			success: "false",
			message: "Vehicle not found"
		});
	}
});

app.put("/api/v1/vehicles/:id", (req, res) => {
	const id = parseInt(req.params.id, 10);
	let vehicleFound;
	let itemIndex;
	db.find((vehicles, index) => {
		if (vehicles.id === id) {
			vehicleFound = vehicles;
			itemIndex = index;
		}
	});

	if (!vehicleFound) {
		return res.status(404).send({
			success: "false",
			message: "Vehicle not found"
		});
	}

	if (!req.body.year) {
		return res.status(400).send({
			success: "false",
			message: "Year is required"
		});
	}
	if (!req.body.make) {
		return res.status(400).send({
			success: "false",
			message: "Make is required"
		});
	} else if (!req.body.model) {
		return res.status(400).send({
			success: "false",
			message: "Model is required"
		});
	}

	const updatedVehicles = {
		id: vehicleFound.id,
		year: req.body.year || vehicleFound.year,
		make: req.body.make || vehicleFound.make,
		model: req.body.model || vehicleFound.model
	};

	db.splice(itemIndex, 1, updatedVehicles);

	return res.status(201).send({
		success: "true",
		message: "Vehicles added successfully",
		updatedVehicles
	});
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
