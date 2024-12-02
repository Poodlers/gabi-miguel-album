export function convertDateFormat(dateString: string) {
	const [year, month, day] = dateString.split('-'); // Split by "-"
	return `${day}/${month}/${year}`; // Rearrange to "DD/MM/YYYY"
}
