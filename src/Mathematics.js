import Component, {Config} from 'metal-jsx';
import {Button, Layout} from './components';
import {CLASSNAME, LANGUAGE} from './Utils';

import './style/mathematics.scss';

class Mathematics extends Component {
	created() {
		this.state.countdown = this.props.time;
		this.setInitLvl();
		this.setInitGame();
	}

	setInitLvl() {
		[].map.call(this.props.lvls, lvl => {
			if (lvl.default) this.state.lvl = lvl;
		});
	}

	setLvl(label) {
		[].map.call(this.props.lvls, lvl => {
			if (lvl.label === label) this.state.lvl = lvl;
		});
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
			case '+': result = n1 + n2; break;
			case '-': result = n1 - n2; break;
			case 'x': result = n1 * n2; break;
			case '÷': result = n1 / n2; break;
			default: result = undefined; break;
		}

		return result.toFixed(0);
	}

	setCountDown() {
		let interval = setInterval(() => {
			this.state.countdown -= 1;
		}, 1000);

		setTimeout(() => {
			clearInterval(interval);

			this.state.countdown = this.props.time;
			this.setFinishGame();
		}, this.props.time * 1000);
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
			this.state.message = LANGUAGE.yeah;
		} else {
			this.state.errors += 1;
			this.state.message = LANGUAGE.ops;
		}

		event.target.result.value = '';
		event.target.result.focus();
	}

	_handleClickSelectNumber(event) {
		if (event.target.type !== 'button') return;

		event.delegateTarget.result.value += event.target.name;
		event.delegateTarget.result.focus();
	}

	renderUIButtons() {
		[].map.call(this.props.lvls, (_lvl, index) => {
			return (
				<Button
					data-lvl={_lvl.label}
					data-onclick={this._handleClickToggleLvl.bind(this)}
					isActive={this.state.lvl.label === _lvl.label ? true : false}>
					{_lvl.label}
				</Button>
			);
		});
	}

	renderInitGame() {
		const {lvl} = this.state;

		return (
			<Layout>
				<Layout.Header>{LANGUAGE.initGame}</Layout.Header>
				<Layout.Body>
					{this.renderUIButtons()}

					<Button
						className={'primary'}
						data-onclick={this._handleClickStartGame.bind(this)}>
							{LANGUAGE.startGame}
					</Button>
				</Layout.Body>
				<Layout.Footer></Layout.Footer>
			</Layout>
		);
	}

	renderStartGame() {
		const {lvl, n1, n2, operator, message, errors, hits, countdown} = this.state;
		const result = this.getCalc(n1, n2, operator);

		return (
			<Layout>
				<Layout.Header>
					{lvl.label} {countdown}
				</Layout.Header>
				<Layout.Body>
					{`${n1} ${operator} ${n2} = ${result}`}

					<form
						data-onclick={this._handleClickSelectNumber.bind(this)}
						data-onsubmit={this._handleValidadeExpression.bind(this)}>

						<input
							name="result"
							data-result={result}
							type="number"
							required
						/>

						{/* <div>
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

						<button type="submit">{LANGUAGE.next}</button> */}

						<div>
							<Button type="button" name="7">7</Button>
							<Button type="button" name="8">8</Button>
							<Button type="button" name="9">9</Button>
						</div>

						<div>
							<Button type="button" name="4">4</Button>
							<Button type="button" name="5">5</Button>
							<Button type="button" name="6">6</Button>
						</div>

						<div>
							<Button type="button" name="1">1</Button>
							<Button type="button" name="2">2</Button>
							<Button type="button" name="3">3</Button>
						</div>

						<div>
							<Button type="button" name="0">0</Button>
						</div>

						<Button type="submit">{LANGUAGE.next}</Button>
					</form>

					{message}
				</Layout.Body>
				<Layout.Footer>
					{`${LANGUAGE.hits}: ${hits}, ${LANGUAGE.errors} ${errors}`}
				</Layout.Footer>
			</Layout>
		);
	}

	renderFinishGame() {
		const {hits, errors} = this.state;

		return (
			<Layout>
				<Layout.Header>{LANGUAGE.finishGame}</Layout.Header>
				<Layout.Body>
					{this.renderUIButtons()}

					<Button
						className={'primary'}
						data-onclick={this._handleClickStartGame.bind(this)}>
						{LANGUAGE.startGameAgain}
					</Button>
				</Layout.Body>
				<Layout.Footer>
					{`${LANGUAGE.totalHits}: ${hits}, ${LANGUAGE.totalErrors} ${errors}`}
				</Layout.Footer>
			</Layout>
		);
	}

	render() {
		const {start, finish, init, lvl} = this.state;

		return (
			<div class={`${CLASSNAME} ${CLASSNAME}--lvl-${lvl.internalLabel}`}>
				<div class={`${CLASSNAME}__body iphone-x`}>
					{init &&
						<div class={`${CLASSNAME}__init`}>
							{this.renderInitGame()}
						</div>}

					{start &&
						<div class={`${CLASSNAME}__start`}>
							{this.renderStartGame()}
						</div>}

					{finish &&
						<div class={`${CLASSNAME}__finish`}>
							{this.renderFinishGame()}
						</div>}
				</div>
			</div>
		);
	}
}

Mathematics.PROPS = {
	lvls: Config.arrayOf(
		Config.shapeOf({
			default: Config.bool().required(),
			internalLabel: Config.string().required(),
			label: Config.string().required(),
			maxNumber: Config.number().required(),
			operators: Config.arrayOf(
				Config.shapeOf({
					label: Config.string().required(),
					id: Config.number().required()
				}).required()
			)
		}).required()
	).required(),
	time: Config.number().required()
}

Mathematics.STATE = {
	lvl: Config.shapeOf({
		default: Config.bool(),
		internalLabel: Config.string(),
		label: Config.string(),
		maxNumber: Config.number(),
		operator: Config.shapeOf({
			label: Config.string()
		})
	}),
	countdown: Config.number(),
	errors: Config.number().value(0),
	finish: Config.bool().value(false),
	hits: Config.number().value(0),
	init: Config.bool().value(true),
	message: Config.string(),
	n1: Config.number().value(0),
	n2: Config.number().value(0),
	operator: Config.string().value('+'),
	start: Config.bool().value(false),
}

export { Mathematics };
export default Mathematics;
