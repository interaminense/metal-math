import Component, {Config} from 'metal-jsx';
import {Button} from './components';
import {CLASSNAME} from './Utils';

import './style/mathematics.scss';

const LVL_DEFAULT = {
	label: 'normal',
	maxNumber: 5,
	operator: {
		label: '+'
	}
};

const MESSAGE = {
	success: 'Yeah! Congratulations!',
	error: 'Ops, try again!'
};

const COUNTDOWN = 5;

class Mathematics extends Component {
	created() {
		this.setInitGame();
	}

	nextOperation() {
		let n1 = this.getRandomNumber(0, this.state.lvl.maxNumber);
		let n2 = this.getRandomNumber(0, this.state.lvl.maxNumber);

		if (n1 > n2) {
			this.state.n1 = n1;
			this.state.n2 = n2;
		} else {
			this.state.n1 = n2;
			this.state.n2 = n1;
		}

		this.state.operator = this.getRandomOperator();
	}

	getRandomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	getRandomOperator() {
		const randomNumber = this.getRandomNumber(0, this.state.lvl.operators.length - 1);
		const operator = this.state.lvl.operators[randomNumber];

		return operator.label
	}

	getCalc(n1, n2, operator) {
		let result = 0;

		switch(operator) {
			case '+':
				result = n1 + n2;
				break;
			case '-':
				result = n1 - n2;
				break;
			case 'x':
				result = n1 * n2;
				break;
			case '÷':
				result = n1 / n2;
				break;
			default:
				result = undefined;
				break;
		}

		return result.toFixed(0);
	}

	// getFormatNumber(n = 0) {
	// 	return isFinite(n) ? n.toFixed(0) : 0;
	// }

	setLvl(label = LVL_DEFAULT.label) {
		[].map.call(this.props.lvls, (lvl, index) => {
			if (lvl.label === label) {
				this.state.lvl = lvl;
			}
		});
	}

	setCountDown() {
		let interval = setInterval(() => {
			this.state.countdown -= 1;

			console.log(this.state.countdown);
		}, 1000);

		setTimeout(() => {
			clearInterval(interval);

			this.state.countdown = COUNTDOWN;
			this.setFinishGame();
		}, COUNTDOWN * 1000);
	}

	setInitGame() {
		this.setLvl();
		this.nextOperation();
	}

	setStartGame() {
		this.nextOperation();

		this.state.hits = 0;
		this.state.errors = 0;
		this.state.message = '';

		this.state.start = true;
		this.state.init = false;
		this.state.finish = false;

		this.setCountDown();
	}

	setFinishGame() {
		this.state.start = false;
		this.state.init = false;
		this.state.finish = true;
	}

	_handleClickStartGame() {
		this.setStartGame();
	}

	_handleClickFinishGame() {
		this.setFinishGame();
	}

	_handleClickToggleLvl(event) {
		let lvl = event.target.getAttribute('data-lvl');

		this.setLvl(lvl);
	}

	_handleValidadeExpression(event) {
		event.preventDefault();

		let value = event.target.result.value;
		let predefinedValue = event.target.result.getAttribute('data-result');

		if (value === predefinedValue) {
			this.nextOperation();
			this.state.hits += 1;
			this.state.message = MESSAGE.success;
		} else {
			this.state.errors += 1;
			this.state.message = MESSAGE.error;
		}

		event.target.result.value = '';
		event.target.result.focus();
	}

	_handleClickSelectNumber(event) {
		if (event.target.type !== 'button') return;

		event.delegateTarget.result.value += event.target.name;
		event.delegateTarget.result.focus();
	}

	renderSelectLvl() {
		const {lvl} = this.state;

		return (
			<div>
				<Button data-lvl="easy" data-onclick={this._handleClickToggleLvl.bind(this)}>
					{'easy'}
				</Button>

				<Button data-lvl="normal" data-onclick={this._handleClickToggleLvl.bind(this)}>
					{'normal'}
				</Button>

				<Button data-lvl="hard" data-onclick={this._handleClickToggleLvl.bind(this)}>
					{'hard'}
				</Button>
			</div>
		);
	}

	renderInitGame() {
		return (
			<div>
				{'init game'}

				{this.renderSelectLvl()}
			</div>
		);
	}

	renderStartGame() {
		const {lvl, n1, n2, operator, message, errors, hits, countdown} = this.state;
		const result = this.getCalc(n1, n2, operator);

		return (
			<div>
				{lvl.label} {countdown}

				<div>
					{`${n1} ${operator} ${n2} = ${result}`}
				</div>

				<form
					data-onclick="_handleClickSelectNumber"
					data-onsubmit="_handleValidadeExpression">

					<input
						name="result"
						data-result={result}
						type="number"
						required
					/>

					<div>
						<button type="button" name="7">7</button>
						<button type="button" name="8">8</button>
						<button type="button" name="9">9</button>
					</div>
					<div>
						<button type="button" name="4">4</button>
						<button type="button" name="5">5</button>
						<button type="button" name="6">6</button>
					</div>
					<div>
						<button type="button" name="1">1</button>
						<button type="button" name="2">2</button>
						<button type="button" name="3">3</button>
					</div>
					<div>
						<button type="button" name="0">0</button>
					</div>

					<button type="submit">enter</button>

				</form>

				<div>{message}</div>

				<div>{`hits: ${hits}, errors ${errors}`}</div>
			</div>
		);
	}

	renderFinishGame() {
		const {hits, errors} = this.state;

		return (
			<div>
				<div>Finish game</div>

				<div>{`total hits: ${hits}, total errors ${errors}`}</div>

				{this.renderSelectLvl()}
			</div>
		);
	}

	render() {
		const {start, finish, init, lvl} = this.state;

		return (
			<div class={`${CLASSNAME} ${CLASSNAME}--lvl-${lvl.label}`}>

				<div class={`${CLASSNAME}__body iphone-x`}>

					{
						init &&
						<div class={`${CLASSNAME}__init`}>
							{this.renderInitGame()}
							<Button data-onclick={this._handleClickStartGame.bind(this)}>
								{'start game'}
							</Button>
						</div>
					}

					{
						start &&
						<div class={`${CLASSNAME}__start`}>
							{this.renderStartGame()}
						</div>
					}

					{
						finish &&
						<div class={`${CLASSNAME}__finish`}>
							{this.renderFinishGame()}
							<Button data-onclick={this._handleClickStartGame.bind(this)}>
								{'start game again'}
							</Button>
						</div>
					}

				</div>

			</div>
		);
	}
}

Mathematics.PROPS = {
	lvls: Config.arrayOf(Config.shapeOf({
		label: Config.string().value(LVL_DEFAULT.label),
		maxNumber: Config.number().value(LVL_DEFAULT.maxNumber),
		operators: Config.arrayOf(Config.shapeOf({
			label: Config.string().value(LVL_DEFAULT.operator.label),
			id: Config.number().value(LVL_DEFAULT.operator.id)
		}))
	}))
}

Mathematics.STATE = {
	lvl: Config.shapeOf({
		label: Config.string().value(LVL_DEFAULT.label),
		maxNumber: Config.number().value(LVL_DEFAULT.maxNumber),
		operator: Config.shapeOf({
			label: Config.string().value(LVL_DEFAULT.operator.label)
		})
	}),
	n1: Config.number().value(0),
	n2: Config.number().value(0),
	operator: Config.string().value('+'),
	message: Config.string(),
	start: Config.bool().value(false),
	finish: Config.bool().value(false),
	init: Config.bool().value(true),
	hits: Config.number().value(0),
	errors: Config.number().value(0),
	countdown: Config.number().value(COUNTDOWN)
}

export { Mathematics };
export default Mathematics;
