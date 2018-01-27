
import '../style/mathematics.scss';
import { setTimeout } from 'timers';
import {Button, Layout, Operation} from './';
import {CLASSNAME, LANGUAGE, CALCULATE, getRandomNumber} from '../utils/Utils';
import {EventHandler} from 'metal-events';
import Component, {Config} from 'metal-jsx';
import dom from 'metal-dom';
import position from 'metal-position';

let removeClassIsCorrect = undefined;
let removeMessage = undefined;

class Mathematics extends Component {
	/**
	 * @inheritdoc
	 * Lifecycle MetalJS
	 */
	created() {
		this.state.countdown = this.props.time;
		this.setLvl(this.props.lvlDefault);
		this.setInitGame();
	}

	/**
	 * @inheritdoc
	 * Lifecycle MetalJS
	 */
	attached() {
		setTimeout(() => {
			this.state.isMobile = this.element.clientWidth < 768 ? true : false;
		}, 0);
	}

	/**
	 * @inheritdoc
	 * Lifecyle MetalJS
	 */
	render() {
		const {
			start,
			finish,
			init,
			lvl,
			isCorrect,
			timeoutAmount
		} = this.state;

		return (
			<div class={`
				${CLASSNAME}
				${CLASSNAME}--lvl-${lvl.internalLabel}
				${isCorrect}
			`}>

				<div class={`${CLASSNAME}__body`}>
					<div
						class={`${CLASSNAME}__timeout-amount`}
						style={`height: ${timeoutAmount}%`}
					/>

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

	/**
	 * Render UI buttons
	 */
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

	/**
	 * Render UI finish game
	 */
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

	/**
	 * Render UI init game
	 */
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
				<Layout.Footer />
			</Layout>
		);
	}

	/**
	 * Render UI start game
	 */
	renderStartGame() {
		const {
			state: {lvl, n1, n2, operator, message, errors, hits, countdown, isMobile},
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
						data-onclick={this._handleClickButton.bind(this)}
						data-onsubmit={this._handleClickValidadeExpression.bind(this)}>

						<input
							name="result"
							data-result={result}
							type="number"
							required
							disabled={isMobile}
						/>

						<div>
							<Button name="7" type="button">7</Button>
							<Button name="8" type="button">8</Button>
							<Button name="9" type="button">9</Button>
						</div>

						<div>
							<Button name="4" type="button">4</Button>
							<Button name="5" type="button">5</Button>
							<Button name="6" type="button">6</Button>
						</div>

						<div>
							<Button name="1" type="button">1</Button>
							<Button name="2" type="button">2</Button>
							<Button name="3" type="button">3</Button>
						</div>

						<div>
							<Button name="0" type="button">0</Button>
							<Button className={'primary'} name="deleteNumber" type="reset">{LANGUAGE.back}</Button>
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

	/**
	 * Return the calculate timeout amout
	 */
	getCalcTimeoutAmout() {
		return 100 / this.props.time;
	}

	/**
	 * Return the random operator
	 */
	getRandomOperator() {
		const randomNumber = getRandomNumber(0, this.state.lvl.operators.length - 1);
		const operator = this.state.lvl.operators[randomNumber];

		return operator.label;
	}

	/**
	 * Set the countdown
	 */
	setCountDown() {
		let interval = setInterval(() => {
			this.state.countdown -= 1;
			this.state.timeoutAmount += this.getCalcTimeoutAmout();
		}, 1000);

		setTimeout(() => {
			clearInterval(interval);

			this.state.countdown = this.props.time;
			this.setFinishGame();
		}, this.props.time * 1000);
	}

	/**
	 * Set the finish game
	 */
	setFinishGame() {
		this.setState({
			start: false,
			init: false,
			finish: true
		});
	}

	/**
	 * Set focus on the input
	 * @param {*} element
	 */
	setFocus(element) {
		if (!this.state.isMobile) {
			element.focus();
		}
	}

	/**
	 * Set init game
	 */
	setInitGame() {
		this.setLvl();
		this.setNextOperation();
	}

	/**
	 * Set class name 'is-correct' or 'is-wrong'
	 * @param {*} isCorrect
	 */
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

	/**
	 * Set level game
	 * @param {*} label
	 */
	setLvl(label) {
		[].map.call(this.props.lvls, lvl => {
			if (lvl.internalLabel === label) this.state.lvl = lvl;
		});
	}

	/**
	 * Set message
	 * @param {*} message
	 */
	setMessage(message) {
		clearTimeout(removeMessage);

		this.state.message = message;

		removeMessage = setTimeout(() => {
			this.state.message = '';
		}, 1000);
	}

	/**
	 * Set the next operation
	 */
	setNextOperation() {
		let n1 = getRandomNumber(0, this.state.lvl.maxNumber);
		let n2 = getRandomNumber(0, this.state.lvl.maxNumber);
		let operator = this.getRandomOperator();
		let result = CALCULATE(n1, n2, operator);

		// If isn't real number, set the next operation
		if (isNaN(result) || !isFinite(result)) {
			this.setNextOperation();
		} else {
			if (n1 > n2) {
				this.setState({n1, n2});
			} else {
				this.setState({
					n1: n2,
					n2: n1
				});
			}
			this.state.operator = operator;
		}
	}

	/**
	 * Set start game
	 */
	setStartGame() {
		this.setNextOperation();

		this.setState({
			errors: 0,
			finish: false,
			hits: 0,
			init: false,
			message: '',
			start: true,
			timeoutAmount: 0
		});

		this.setCountDown();
	}

	/**
	 * Handle click on buttons inside forms
	 * @param {*} event
	 */
	_handleClickButton(event) {
		// If button is a submit type, return
		if (event.target.type !== 'button') {
			return;
		}

		event.delegateTarget.result.value += event.target.name;

		// Set focus on display
		this.setFocus(event.delegateTarget.result);
	}

	/**
	 * Handle click to finish game
	 */
	_handleClickFinishGame() {
		this.setFinishGame();
	}

	/**
	 * Handle click to start game
	 */
	_handleClickStartGame() {
		this.setStartGame();
	}

	/**
	 * Handle click to toggle level game
	 * @param {*} event
	 */
	_handleClickToggleLvl(event) {
		let lvl = event.target.getAttribute('data-lvl');

		this.setLvl(lvl);
	}

	/**
	 * Handle click to validate expression
	 * @param {*} event
	 */
	_handleClickValidadeExpression(event) {
		event.preventDefault();

		if (event.target.result.value === '') return;

		let value = event.target.result.value;
		let predefinedValue = event.target.result.getAttribute('data-result');

		// If is correct value
		if (value === predefinedValue) {
			this.state.hits += 1;
			this.setMessage(LANGUAGE.yeah);
			this.setIsCorrectClassName();
		} else {
			this.state.errors += 1;
			this.setMessage(LANGUAGE.ops);
			this.setIsCorrectClassName(false);
		}

		this.setNextOperation();

		// Clean the result display
		event.target.result.value = '';

		// Set focus on display
		this.setFocus(event.target.result);
	}
}

Mathematics.PROPS = {
	/**
	 * @type {string}
	 * @default undefined
	 * @required
	 */
	lvlDefault: Config.string().required(),

	/**
	 * @type {array}
	 * @default undefined
	 * @required
	 */
	lvls: Config.arrayOf(
		Config.shapeOf({
			internalLabel: Config.string().required(),
			label: Config.string().required(),
			maxNumber: Config.number().required(),
			operators: Config.arrayOf(
				Config.shapeOf({
					label: Config.oneOf(['+', '-', 'x', '÷']).required()
				}).required()
			)
		}).required()
	).required(),

	/**
	 * @type {boolean}
	 * @default false
	 */
	showResult: Config.bool().value(false),

	/**
	 * @type {number}
	 * @default 30
	 */
	time: Config.number().value(30)
}

Mathematics.STATE = {
	/**
	 * @type {number}
	 * @default 0
	 */
	countdown: Config.number().value(0),

	/**
	 * @type {number}
	 * @default 0
	 */
	errors: Config.number().value(0),

	/**
	 * @type {boolean}
	 * @default false
	 */
	finish: Config.bool().value(false),

	/**
	 * @type {number}
	 * @default 0
	 */
	hits: Config.number().value(0),

	/**
	 * @type {boolean}
	 * @default true
	 */
	init: Config.bool().value(true),

	/**
	 * @type {string}
	 * @default undefined
	 */
	isCorrect: Config.string(),

	/**
	 * @type {boolean}
	 * @default false
	 */
	isMobile: Config.bool().value(false),

	/**
	 * @type {string}
	 * @default undefined
	 */
	message: Config.string(),

	/**
	 * @type {array}
	 * @default undefined
	 */
	lvl: Config.shapeOf({
		internalLabel: Config.string(),
		label: Config.string(),
		maxNumber: Config.number(),
		operator: Config.shapeOf({
			label: Config.string()
		})
	}),

	/**
	 * @type {number}
	 * @default 0
	 */
	n1: Config.number().value(0),

	/**
	 * @type {number}
	 * @default 0
	 */
	n2: Config.number().value(0),

	/**
	 * @type {string}
	 * @default +
	 */
	operator: Config.string().value('+'),

	/**
	 * @type {boolean}
	 * @default false
	 */
	start: Config.bool().value(false),

	/**
	 * @type {number}
	 * @default 0
	 */
	timeoutAmount: Config.number().value(0)
}

export { Mathematics };
export default Mathematics;