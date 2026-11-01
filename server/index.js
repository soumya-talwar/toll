import "dotenv/config";
import express from "express";
import {
	getDeliveryCount,
	getGymAttendance,
	markGymAttendance,
} from "./sheet.js";
import calculateCounts from "./calculate.js";
import unlock from "./unlock.js";
const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello world"));

app.get("/api/counts", async (req, res) => {
	const stepCount = Number(req.query?.steps);
	const deliveryCount = await getDeliveryCount();
	const gymAttendance = await getGymAttendance();
	const counts = calculateCounts(deliveryCount, stepCount, gymAttendance);
	res.send(counts);
});

app.get("/api/gym", async (req, res) => {
	await markGymAttendance();
	res.status(200).json({ message: "Gym attendance marked successfully." });
});

app.listen(port, () => console.log(`listening on ${port}!`));
