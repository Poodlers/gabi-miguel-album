export function convertDateFormat(dateString: string) {
	const [year, month, day] = dateString.split('-'); // Split by "-"
	return `${day}/${month}/${year}`; // Rearrange to "DD/MM/YYYY"
}

export const getRelativeTime = (date: Date) => {
	const now = new Date();
	const diff = now.getTime() - date.getTime();
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const months = Math.floor(days / 30);
	const years = Math.floor(months / 12);
	if (years > 0) {
		return `há ${years} ano${years > 1 ? 's' : ''}`;
	} else if (months > 0) {
		return `há ${months} mês${months > 1 ? 'es' : ''}`;
	} else if (days > 0) {
		return `há ${days} dia${days > 1 ? 's' : ''}`;
	} else if (hours > 0) {
		return `há ${hours} hora${hours > 1 ? 's' : ''}`;
	} else if (minutes > 0) {
		return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
	} else {
		return `há ${seconds} segundo${seconds > 1 ? 's' : ''}`;
	}
};
