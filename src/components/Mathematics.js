
import '../style/mathematics.scss';
import {Button, Layout, Operation} from './';
import {
	CLASSNAME,
	URL,
	PATH,
	LANGUAGE,
	CALCULATE,
	getCalcTimeoutAmout,
	getRandomNumber
} from '../utils/utils';
import Fragment from './Fragment';
import {EventHandler} from 'metal-events';
import Component, {Config} from 'metal-jsx';
import dom from 'metal-dom';
import position from 'metal-position';
import _ from 'lodash';
import getCN from 'classnames';
import WeDeploy from 'wedeploy';

let removeClassIsCorrect = undefined;
let removeMessage = undefined;

class Mathematics extends Component {
	/**
	 * Lifecycle MetalJS
	 * @inheritdoc
	 */
	created() {
		this.state.countdown = this.props.countdown;
		this.setLvl(this.props.lvlDefault);
		this.setInitGame();

		WeDeploy.data(URL).get(PATH).then(response => {
			this.state.score = response;
		}).catch(error => {
			console.error(error);
		});

		WeDeploy.data(URL).watch(PATH).on('changes', response => {
			this.state.score = response;
			this.state.loading = '';
		}).on('fail', error => {
			console.log(error);
		});

		setTimeout(() => {
			this.state.isMobile = this.element.clientWidth < 660 ? true : false;

		}, 0);
	}

	/**
	 * Render popup
	 */
	renderPopup() {
		const {
			score,
			currentName,
			isMobile,
			loading,
			popupBtnLabel,
			selectedFilter,
			showPopup
		} = this.state;

		const scoreOrdered = _.orderBy(score, ['points', 'hits'], ['desc', 'desc']);

		const classPopup = getCN(`${CLASSNAME}__popup`, {
			[`${CLASSNAME}__popup-show`]: showPopup
		})

		return (
			<Fragment>
				{isMobile && showPopup && <div class={`${CLASSNAME}__popup-overlay`}></div>}

				<div class={classPopup}>
					<button
						class={`${CLASSNAME}__popup-btn-show`}
						data-onclick={this._handleClickTogglePopup.bind(this)}>
							{popupBtnLabel}
					</button>

					<div class={`${CLASSNAME}__popup-title`}>
						{LANGUAGE.score}
						<span class={`${CLASSNAME}__popup-loading`}>{loading}</span>
					</div>
					<div class={`${CLASSNAME}__popup-btn`}>{this.renderUIButtonsFilterLevel()}</div>

					<div class={`${CLASSNAME}__popup-body`}>
						<table class={`${CLASSNAME}__table`}>
							<thead>
								<tr>
									<th></th>
									<th style={'width: 100%'} class={`${CLASSNAME}__text-left`}>{LANGUAGE.name}</th>
									<th class={`${CLASSNAME}__text-left`}>{LANGUAGE.lvl}</th>
									<th class={`${CLASSNAME}__text-right`}>{LANGUAGE.hits}</th>
									<th class={`${CLASSNAME}__text-right`}>{LANGUAGE.errors}</th>
									<th class={`${CLASSNAME}__text-right`}>{LANGUAGE.points}</th>
								</tr>
							</thead>
							<tbody>
								{scoreOrdered
									.filter(({points, lvl}) => selectedFilter === lvl || selectedFilter === 'all')
									.map(({errors, hits, lvl, name, points}, index) => {
										return (
											<tr class={name === currentName ? `${CLASSNAME}__tr-active` : ''}>
												<td class={`${CLASSNAME}__text-left`}>
													<strong>{index + 1}</strong>
												</td>
												<td class={`${CLASSNAME}__text-left`}>
													{index === 0 && <span>🥇</span>}
													{index === 1 && <span>🥈</span>}
													{index === 2 && <span>🥉</span>}
													{name}
												</td>
												<td class={`${CLASSNAME}__text-left`}>{lvl}</td>
												<td class={`${CLASSNAME}__text-right`}>{hits}</td>
												<td class={`${CLASSNAME}__text-right`}>{errors}</td>
												<td class={`${CLASSNAME}__text-right`}>{points}</td>
											</tr>
										);
								})}
						</tbody>
						</table>
					</div>
				</div>
			</Fragment>
		);
	}

	/**
	 * Lifecyle MetalJS
	 * @inheritdoc
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
			<div class={`mathematics mathematics--lvl-${lvl.internalLabel} ${isCorrect}`}>

				{this.renderPopup()}

				<div class={'mathematics__body'}>
					<div
						class={'mathematics__timeout-amount'}
						style={`height: ${timeoutAmount}%`}
					/>

					{init &&
						<div class={'mathematics__init'}>
							{this.renderInitGame()}
						</div>}

					{start &&
						<div class={'mathematics__start'}>
							{this.renderStartGame()}
						</div>}

					{finish &&
						<div class={'mathematics__finish'}>
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
		this.props.lvls.map((lvl, index) => {
			const isActive = this.state.lvl.internalLabel === lvl.internalLabel ? true : false;

			return (
				<Button
					data-lvl={lvl.internalLabel}
					data-onclick={this._handleClickToggleLvl.bind(this)}
					isActive={isActive}>
					{lvl.label}
				</Button>
			);
		});
	}

	/**
	 * Render UI buttons
	 */
	renderUIButtonsFilterLevel() {
		let isActive = this.state.selectedFilter === 'all' ? true : false;

		return (
			<Fragment>
				<Button
					data-lvl={'all'}
					data-onclick={this._handleClickFilterLevel.bind(this)}
					isActive={isActive}
					size={'sm'}>
					{LANGUAGE.all}
				</Button>

				{this.props.lvls.map((lvl, index) => {
					isActive = this.state.selectedFilter === lvl.internalLabel ? true : false;

					return (
						<Button
							data-lvl={lvl.internalLabel}
							data-onclick={this._handleClickFilterLevel.bind(this)}
							isActive={isActive}
							size={'sm'}>
							{lvl.label}
						</Button>
					);
				})}

			</Fragment>
		);
	}

	/**
	 * Render UI finish game
	 */
	renderFinishGame() {
		const {hits, errors, finish, points, showSaveScore} = this.state;

		return (
			<Layout>
				<Layout.Header>{LANGUAGE.finishGame}</Layout.Header>

				<Layout.Body>
					<div class={`${CLASSNAME}__message-hits`}>
						<div>{`🤩 ${hits}`}</div>
						<div>{`😰 ${errors}`}</div>
						<div>{`😎 ${points}`}</div>
					</div>

					{showSaveScore && this.renderFormSaveScore()}

					{this.renderUIButtons()}

					<Button
						style={'primary'}
						data-onclick={this._handleClickStartGame.bind(this)}>
						{LANGUAGE.startGameAgain}
					</Button>
				</Layout.Body>

				<Layout.Footer>
					{this.renderCurrentPoints()}
				</Layout.Footer>
			</Layout>
		);
	}

	/**
	 * Render UI init game
	 */
	renderInitGame() {
		return (
			<Layout>
				<Layout.Header>{LANGUAGE.initGame}</Layout.Header>
				<Layout.Body>
					{this.renderUIButtons()}

					<Button
						style={'primary'}
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
			state: {lvl, n1, n2, operator, message, countdown, isMobile},
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
						data-onsubmit={this._handleClickValidateExpression.bind(this)}>

						<input
							class={`${CLASSNAME}__input-custom`}
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
							<Button style={'primary'} name="deleteNumber" type="reset">{LANGUAGE.reset}</Button>
							<Button style={'primary'} type="submit">{LANGUAGE.next}</Button>
						</div>

					</form>
				</Layout.Body>
				<Layout.Footer>
					{this.renderCurrentPoints()}
				</Layout.Footer>
			</Layout>
		);
	}

	/**
	 * Render the form save score
	 */
	renderFormSaveScore() {
		return (
			<form class={`${CLASSNAME}__form-save`} data-onsubmit={this._handleClickSaveScore.bind(this)}>
				{LANGUAGE.saveYourScore}

				<input
					class={`${CLASSNAME}__input-custom`}
					placeholder={LANGUAGE.whatYourName}
					type="text"
					required
					maxlength="15"
					name="name"
				/>
				<Button style={'primary'} type="submit">{LANGUAGE.save}</Button>
			</form>
		);
	}

	/**
	 * Render the current points
	 */
	renderCurrentPoints() {
		const {hits, errors, points} = this.state;

		return (
			<Fragment>
				<span>{`${LANGUAGE.hits}: ${hits}, ${LANGUAGE.errors} ${errors}, `}</span>
				<span class={`${CLASSNAME}__text-rainbow`}>{`${LANGUAGE.points}: ${points}`}</span>
			</Fragment>
		);
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
			this.state.timeoutAmount += getCalcTimeoutAmout(this.props.countdown);
		}, 1000);

		setTimeout(() => {
			clearInterval(interval);

			this.state.countdown = this.props.countdown;
			this.setFinishGame();
		}, this.props.countdown * 1000);
	}

	/**
	 * Set the finish game
	 */
	setFinishGame() {
		this.setState({
			currentName: '',
			start: false,
			init: false,
			finish: true,
			showSaveScore: true
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
	 * @param {boolean} isCorrect
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
	 * @param {string} label
	 */
	setLvl(label) {
		this.props.lvls.map(lvl => {
			if (lvl.internalLabel === label) {
				this.state.lvl = lvl;
			}
		});
	}

	/**
	 * Set message
	 * @param {string} message
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
			points: 0,
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
	 * @param {object} event
	 */
	_handleClickToggleLvl({target}) {
		const lvl = target.dataset.lvl;

		this.setLvl(lvl);
	}

	/**
	 * Handle click to toggle popup
	 */
	_handleClickTogglePopup() {
		this.state.showPopup = !this.state.showPopup;

		if (this.state.showPopup) {
			this.state.popupBtnLabel = LANGUAGE.closePopup;
		} else {
			this.state.popupBtnLabel = LANGUAGE.openPopup;
		}
	}

	/**
	 * Handle click to filter level
	 * @param {object} event
	 */
	_handleClickFilterLevel({target}) {
		this.state.selectedFilter = target.dataset.lvl;
	}

	/**
	 * Handle click to validate expression
	 * @param {object} event
	 */
	_handleClickValidateExpression(event) {
		event.preventDefault();

		if (event.target.result.value === '') return;

		const value = event.target.result.value;
		const predefinedValue = event.target.result.dataset.result;

		// If is correct value
		if (value === predefinedValue) {
			this.state.hits += 1;
			this.state.points += 1;
			this.setMessage(LANGUAGE.yeah);
			this.setIsCorrectClassName();
		} else {
			this.state.errors += 1;
			this.state.points -= this.state.lvl.lostPoints;
			this.setMessage(LANGUAGE.ops);
			this.setIsCorrectClassName(false);
		}

		this.setNextOperation();

		// Clean the result display
		event.target.result.value = '';

		// Set focus on display
		this.setFocus(event.target.result);
	}

	/**
	 * Handle click to save score
	 * @param {object} target
	 */
	_handleClickSaveScore({target}) {
		event.preventDefault();

		const errors = this.state.errors;
		const hits = this.state.hits;
		const lvl = this.state.lvl.internalLabel;
		const name = target.name.value;
		const points = this.state.points;

		WeDeploy.data(URL).create(PATH, {
			errors,
			hits,
			lvl,
			name,
			points
		}).then(data => {
			console.log(data);
		}).catch(error => {
			console.error(error);
		});

		this.setState({
			currentName: target.name.value,
			loading: LANGUAGE.loading,
			showSaveScore: false
		});
	}
}

Mathematics.PROPS = {
	/**
	 * @type {number}
	 * @default 30
	 */
	countdown: Config.number().value(30),

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
			),
			lostPoints: Config.number().required()
		}).required()
	).required(),

	/**
	 * @type {boolean}
	 * @default false
	 */
	showResult: Config.bool().value(false)
}

Mathematics.STATE = {
	/**
	 * @type {number}
	 * @default 0
	 */
	countdown: Config.number().value(0),

	/**
	 * @type {string}
	 * @default ''
	 */
	currentName: Config.string().value(''),

	/**
	 * @type {boolean}
	 * @default false
	 */
	showSaveScore: Config.bool().value(false),

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
	 * @default ''
	 */
	isCorrect: Config.string().value(''),

	/**
	 * @type {boolean}
	 * @default false
	 */
	isMobile: Config.bool().value(false),

	/**
	 * @type {string}
	 * @default undefined
	 */
	loading: Config.string(),

	/**
	 * @type {string}
	 * @default 'all'
	 */
	selectedFilter: Config.string().value('all'),

	/**
	 * @type {boolean}
	 * @default true
	 */
	showPopup: Config.bool().value(true),

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
		}),
		lostPoints: Config.number()
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
	 * @type {number}
	 * @default 0
	 */
	points: Config.number().value(0),

	/**
	 * @type {string}
	 * @default LANGUAGE.closePopup
	 */
	popupBtnLabel: Config.string().value(LANGUAGE.closePopup),

	/**
	 * @type {array}
	 * @default undefined
	 */
	score: Config.array(),

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
