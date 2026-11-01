import express from "express";
import getDeliveryCount from "./sheet.js";
import calculateCounts from "./calculate.js";
import unlock from "./unlock.js";
const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello world"));

app.get("/api/counts", async (req, res) => {
	const stepCount = Number(req.query?.steps);
	const deliveryCount = await getDeliveryCount();
	const counts = calculateCounts(deliveryCount, stepCount);
	res.send(counts);
});

app.listen(port, () => console.log(`listening on ${port}!`));
