export default function calculateAngle(vectorA, vectorB) {
	let dot = vectorA.x * vectorB.x + vectorA.y * vectorB.y;
	let magnitudeA = Math.sqrt(vectorA.x ** 2 + vectorA.y ** 2);
	let magnitudeB = Math.sqrt(vectorB.y ** 2 + vectorB.y ** 2);
	let acos = Math.acos(dot / (magnitudeA * magnitudeB));
	let degrees = acos * (180 / Math.PI);
	return degrees;
}
