const CLASSNAME = 'mathematics';
const PATH = 'score';
const URL = 'https://db-mathematics.wedeploy.io';

/**
 * Object list language
 */
const LANGUAGE = {
	all: '🎲 all',
	closePopup: '✖️',
	errors: 'errors',
	hits: 'hits',
	loading: '⏳ loading...',
	lvl: 'level',
	next: 'next',
	openPopup: '🏆 show score',
	ops: '🤦 Ops, try again!',
	name: 'name',
	points: 'points',
	position: 'position',
	totalErrors: 'total erros',
	totalHits: 'total hits',
	yeah: '👏 Yeah, congratulations!',
	initGame: '🎮 Mathematics',
	score: '🏆 Score',
	startGame: '🏁 Start game',
	finishGame: '🎯 Game Over',
	reset: 'reset',
	save: '💾 save',
	whatYourName: 'What your name?',
	saveYourScore: 'Save your score',
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

export {
	CALCULATE,
	CLASSNAME,
	getCalcTimeoutAmout,
	getRandomNumber,
	LANGUAGE,
	PATH,
	URL
};
