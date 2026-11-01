import { URLSearchParams } from "node:url";

export default async function unlock() {
	const params = new URLSearchParams({
		clientId: process.env.CLIENT_ID,
		accessToken: process.env.ACCESS_TOKEN,
		lockId: process.env.LOCK_ID,
		date: Date.now(),
	});
	try {
		const response = await fetch("https://api.sciener.com/v3/lock/unlock", {
			method: "POST",
			headers: {
				"Content-type": "application/x-www-form-urlencoded",
			},
			body: params,
		});
		if (!response.ok) console.log("Response not okay");
		const result = await response.json();
		console.log("Working! Result: ", result);
	} catch (error) {
		console.log("Error: " + error);
	}
}
