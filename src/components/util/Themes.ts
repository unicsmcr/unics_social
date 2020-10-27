export function isHalloween() {
	const dateToday = new Date();

	if ((dateToday.getMonth() === 9 && dateToday.getDate() >= 29) || (dateToday.getMonth() === 10 && dateToday.getDate() === 1)) {
		return true;
	}

	return false;
}
