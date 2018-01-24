import Component, {Config} from 'metal-jsx';
import {EventHandler} from 'metal-events';
import dom from 'metal-dom';
import position from 'metal-position';
import {Button, Layout, Operation} from './components';
import {CLASSNAME, LANGUAGE, CALCULATE, getRandomNumber} from './Utils';

import './style/mathematics.scss';

let removeClassIsCorrect = undefined;
let removeMessage = undefined;

class Mathematics extends Component {
	created() {
		this.state.countdown = this.props.time;
		this.setLvl(this.props.lvlDefault);
		this.setInitGame();
	}

	attached() {
		this.state.isMobile = this.element.clientWidth < 768 ? true : false;
	}

	calcTimeoutAmout() {
		return 100 / this.props.time;
	}

	getRandomOperator() {
		const randomNumber = getRandomNumber(0, this.state.lvl.operators.length - 1);
		const operator = this.state.lvl.operators[randomNumber];

		return operator.label;
	}

	nextOperation() {
		let n1 = getRandomNumber(0, this.state.lvl.maxNumber);
		let n2 = getRandomNumber(0, this.state.lvl.maxNumber);
		let operator = this.getRandomOperator();
		let result = CALCULATE(n1, n2, operator);

		if (isNaN(result) || !isFinite(result)) {
			this.nextOperation();
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

	setFinishGame() {
		this.setState({
			start: false,
			init: false,
			finish: true
		});
	}

	setFocus(element) {
		if (!this.state.isMobile) {
			element.focus();
		}
	}

	setInitGame() {
		this.setLvl();
		this.nextOperation();
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

	setLvl(label) {
		[].map.call(this.props.lvls, lvl => {
			if (lvl.internalLabel === label) this.state.lvl = lvl;
		});
	}

	setStartGame() {
		this.nextOperation();

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

		this.setFocus(event.target.result);
	}

	_handleClickButton(event) {
		if (event.target.type !== 'button') {
			return;
		} else if (event.target.name == 'deleteNumbers') {
			event.delegateTarget.result.value = 0;
		} else {
			event.delegateTarget.result.value += event.target.name;
		}

		this.setFocus(event.delegateTarget.result);
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
						data-onclick={this._handleClickButton.bind(this)}
						data-onsubmit={this._handleValidadeExpression.bind(this)}>

						<input
							name="result"
							data-result={result}
							type="number"
							required
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
							<Button className={'primary'} name="deleteNumber" type="button">{LANGUAGE.back}</Button>
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
					id: Config.number().required(),
					label: Config.string().required()
				}).required()
			)
		}).required()
	).required(),
	showResult: Config.bool().value(false),
	time: Config.number().value(30)
}

Mathematics.STATE = {
	countdown: Config.number(),
	errors: Config.number().value(0),
	finish: Config.bool().value(false),
	hits: Config.number().value(0),
	init: Config.bool().value(true),
	isCorrect: Config.string().value(''),
	isMobile: Config.bool().value(false),
	message: Config.string(),
	lvl: Config.shapeOf({
		internalLabel: Config.string(),
		label: Config.string(),
		maxNumber: Config.number(),
		operator: Config.shapeOf({
			label: Config.string()
		})
	}),
	n1: Config.number().value(0),
	n2: Config.number().value(0),
	operator: Config.string().value('+'),
	start: Config.bool().value(false),
	timeoutAmount: Config.number().value(0)
}

export { Mathematics };
export default Mathematics;
