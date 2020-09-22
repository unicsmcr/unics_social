const potentials: string[] = [];

function shuffleQuestions() {
	const copy = [...SAMPLE_QUESTIONS];
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
	'Where are you from?',
	'Which course are you studying?',
	'Which year are you in?',
	'Where are you staying?',
	'What are you excited for this year?',
	'How was your summer?',
	'Have you visited Manchester before?',
	'What societies have you joined or planning to join?',
	'What do you do for fun?',
	'What do you want to do after graduating?'
];
