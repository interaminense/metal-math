/**
 * Object list language
 */
const LANGUAGE = {
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
	reset: 'reset',
	startGameAgain: '🏁 Start game again',
	time: '🕑'
};

/**
 * Return result calculate
 * @param {number} n1
 * @param {number} n2
 * @param {string} operator
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
 * Return the calculate timeout amout
 * @param {number} time
 */
const getCalcTimeoutAmout = (time) => {
	return 100 / time;
}

/**
 * Return random number
 * @param {number} min
 * @param {number} max
 */
const getRandomNumber = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export {LANGUAGE, CALCULATE, getCalcTimeoutAmout, getRandomNumber};
