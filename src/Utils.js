/**
 * Class name default
 */
const CLASSNAME = 'mathematics';

/**
 * Object list language
 */
const LANGUAGE = {
	back: 'back',
	errors: 'errors',
	hits: 'hits',
	next: 'next',
	ops: '🤦 Ops, try again!',
	totalErrors: 'total erros',
	totalHits: 'total hits',
	yeah: '👏 Yeah, congratulations!',
	initGame: '🎮 Mathematics',
	startGame: '🏁 Start game',
	finishGame: '🎯 Game Over',
	startGameAgain: '🏁 Start game again',
	time: '🕑'
};

/**
 * Return result calculate
 * @param {*} n1
 * @param {*} n2
 * @param {*} operator
 */
const CALCULATE = (n1, n2, operator) => {
	let result = 0;

	switch(operator) {
		case '+': result = n1 + n2; break;
		case '-': result = n1 - n2; break;
		case 'x': result = n1 * n2; break;
		case '÷': result = n1 / n2; break;
		default: result = null; break;
	}

	return result.toFixed(0);
};

/**
 * Return random number
 * @param {*} min
 * @param {*} max
 */
const getRandomNumber = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export {CLASSNAME, LANGUAGE, CALCULATE, getRandomNumber};
