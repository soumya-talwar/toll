import express from "express";
import unlock from "./unlock.js";
const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello world"));

app.get("/api", (req, res) => {
	// unlock();
	res.send("Unlocking!!");
});

app.listen(port, () => console.log(`listening on ${port}!`));
