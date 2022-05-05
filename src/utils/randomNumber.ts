export default function randomNumber(length: number): string {
	if (!Number.isInteger(length) || (length < 1)) {
		throw "randomNumber: length must be a positive integer";
	}
	return Math.random().toString().slice(2, (2 + length));
}