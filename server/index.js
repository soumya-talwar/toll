import express from "express";
const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello world"));

app.get("/api", (req, res) => res.send("Hey front-end! I am here!"));

app.listen(port, () => console.log(`listening on ${port}!`));
