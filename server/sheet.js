import { google } from "googleapis";
const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
const auth = new google.auth.GoogleAuth({
	credentials: serviceAccount,
	scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });
const spreadsheetId = process.env.GOOGLE_SHEET_ID;

export async function getDeliveryCount() {
	const response = await sheets.spreadsheets.values.get({
		spreadsheetId,
		range: "Totals!L17",
	});
	return Number(response?.data?.values?.[0]?.[0]);
}

export async function getGymAttendance() {
	const response = await sheets.spreadsheets.values.get({
		spreadsheetId,
		range: "Gym!A2:A",
	});
	const values = response?.data?.values;
	const date = new Date(Number(values[values.length - 1]));
	return date.toDateString() === new Date().toDateString();
}
