const potentials: string[] = [];

function shuffleQuestions() {
	const copy = [...SAMPLE_QUESTIONS];
	potentials.splice(0, potentials.length);
	while (copy.length > 0) {
		const index = Math.floor(Math.random() * copy.length);
		potentials.push(...copy.splice(index, 1));
	}
}

export default function pickQuestions(n = 3): string[] {
	if (potentials.length < n) {
		shuffleQuestions();
	}
	return potentials.splice(0, n);
}

export const SAMPLE_QUESTIONS = [
	'What are your plans for Easter break?',
	'What is the best part about Easter for you?',
	'How are you finding University so far, especially with the remote studying?',
	'How is life different from what you did before going to University?',
	'What is your favourite movie or TV show?',
	'What is your favourite dish or dessert?',
	'What is a place you want to visit someday?'
];
