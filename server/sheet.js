import { google } from "googleapis";

export default async function getDeliveryCount() {
	const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
	const auth = new google.auth.GoogleAuth({
		credentials: serviceAccount,
		scopes: ["https://www.googleapis.com/auth/spreadsheets"],
	});
	const sheets = google.sheets({ version: "v4", auth });
	const spreadsheetId = process.env.GOOGLE_SHEET_ID;
	const response = await sheets.spreadsheets.values.get({
		spreadsheetId,
		range: "Totals!L17",
	});
	return Number(response?.data?.values?.[0]?.[0]);
}
