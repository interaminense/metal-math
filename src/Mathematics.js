import Component, {Config} from 'metal-jsx';
import {EventHandler} from 'metal-events';
import dom from 'metal-dom';
import position from 'metal-position';
import {Button, Layout, Operation} from './components';
import {CLASSNAME, LANGUAGE, CALCULATE} from './Utils';

import './style/mathematics.scss';

let removeClassIsCorrect = undefined;
let removeMessage = undefined;

class Mathematics extends Component {
	created() {
		this.state.countdown = this.props.time;
		this.setLvl(this.props.lvlDefault);
		this.setInitGame();

		// this.EventHandler_ = new EventHandler();
	}

	attached() {
		this.state.elementWidth = this.element.clientWidth;
	}

	setLvl(label) {
		[].map.call(this.props.lvls, lvl => {
			if (lvl.internalLabel === label) this.state.lvl = lvl;
		});
	}

	nextOperation() {
		let n1 = this.getRandomNumber(0, this.state.lvl.maxNumber);
		let n2 = this.getRandomNumber(0, this.state.lvl.maxNumber);
		let operator = this.getRandomOperator();
		let result = CALCULATE(n1, n2, operator);

		if (isNaN(result) || !isFinite(result)) {
			this.nextOperation();
		} else {
			if (n1 > n2) {
				this.state.n1 = n1;
				this.state.n2 = n2;
			} else {
				this.state.n1 = n2;
				this.state.n2 = n1;
			}
			this.state.operator = operator;
		}
	}

	getRandomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	getRandomOperator() {
		const randomNumber = this.getRandomNumber(0, this.state.lvl.operators.length - 1);
		const operator = this.state.lvl.operators[randomNumber];

		return operator.label
	}

	calcTimeoutAmout() {
		return 100 / this.props.time;
	}

	setCountDown() {
		let interval = setInterval(() => {
			this.state.countdown -= 1;
			this.state.timeoutAmount += this.calcTimeoutAmout();
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

		this.state.timeoutAmount = 0;

		this.setCountDown();
	}

	setFinishGame() {
		this.state.start = false;
		this.state.init = false;
		this.state.finish = true;
	}

	setIsCorrectClassName(isCorrect = true) {
		clearTimeout(removeClassIsCorrect);

		if (isCorrect) {
			this.state.isCorrect = `${CLASSNAME}--is-correct`;
		} else {
			this.state.isCorrect = `${CLASSNAME}--is-wrong`;
		}

		removeClassIsCorrect = setTimeout(() => {
			this.state.isCorrect = '';
		}, 1000);
	}

	setMessage(message) {
		clearTimeout(removeMessage);

		this.state.message = message;

		removeMessage = setTimeout(() => {
			this.state.message = '';
		}, 1000);
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
			this.state.hits += 1;
			this.setMessage(LANGUAGE.yeah);
			this.setIsCorrectClassName();
		} else {
			this.state.errors += 1;
			this.setMessage(LANGUAGE.ops);
			this.setIsCorrectClassName(false);
		}

		this.nextOperation();

		event.target.result.value = '';

		console.log(this.state.elementWidth);

		if (this.state.elementWidth > 768) {
			event.target.result.focus();
		}
	}

	_handleClickSelectNumber(event) {
		if (event.target.type !== 'button') return;

		event.delegateTarget.result.value += event.target.name;

		if (this.state.elementWidth > 768) {
			event.delegateTarget.result.focus();
		}
	}

	renderUIButtons() {
		[].map.call(this.props.lvls, (lvl, index) => {
			return (
				<Button
					data-lvl={lvl.internalLabel}
					data-onclick={this._handleClickToggleLvl.bind(this)}
					isActive={this.state.lvl.internalLabel === lvl.internalLabel ? true : false}>
					{lvl.label}
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
		const {
			state: {lvl, n1, n2, operator, message, errors, hits, countdown},
			props: {showResult}
		} = this;
		const result = CALCULATE(n1, n2, operator);

		return (
			<Layout>
				<Layout.Header>
					<div class={`${CLASSNAME}__flex-center-between-horizontal`}>
						<div>{lvl.label}</div>
						<div>{`${LANGUAGE.time} ${countdown}`}</div>
					</div>
				</Layout.Header>
				<Layout.Body>
					<Operation
						number1={n1}
						number2={n2}
						operator={operator}
						showResult={showResult}
					/>

					<div class={`${CLASSNAME}__message`}>{message}</div>

					<form
						data-onclick={this._handleClickSelectNumber.bind(this)}
						data-onsubmit={this._handleValidadeExpression.bind(this)}>

						<input
							name="result"
							data-result={result}
							type="number"
							required
						/>

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
							<Button className={'primary'} type="submit">{LANGUAGE.next}</Button>
						</div>

					</form>
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
					<div class={`${CLASSNAME}__message-hits`}>
						<div>{`🤩 ${hits}`}</div>
						<div>{`😰 ${errors}`}</div>
					</div>

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
		const {start, finish, init, lvl, isCorrect, timeoutAmount} = this.state;

		return (
			<div class={`
				${CLASSNAME}
				${CLASSNAME}--lvl-${lvl.internalLabel}
				${isCorrect}
			`}>

				<Animations />

				<div class={`${CLASSNAME}__body`}>
					<div class={`${CLASSNAME}__timeout-amount`} style={`height: ${timeoutAmount}%`} />

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
	lvlDefault: Config.string().required(),
	lvls: Config.arrayOf(
		Config.shapeOf({
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
	showResult: Config.bool().value(false),
	time: Config.number().value(30)
}

Mathematics.STATE = {
	lvl: Config.shapeOf({
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
	isCorrect: Config.string().value(''),
	timeoutAmount: Config.number().value(0),
	elementWidth: Config.number().value(0)
}

export { Mathematics };
export default Mathematics;
