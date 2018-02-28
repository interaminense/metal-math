import Component, {Config} from 'metal-jsx';
import {CALCULATE} from './../utils/Utils.js';

class Operation extends Component {
	/**
	 * Lifecycle MetalJS
	 * @inheritdoc
	 */
	render() {
		const {number1, number2, operator, showResult} = this.props;
		const result = CALCULATE(number1, number2, operator);

		return (
			<div class={'mathematics__operation'}>
				{`${number1} ${operator} ${number2}${showResult ? `= ${result}` : ''}`}
			</div>
		);
	}
}

Operation.PROPS = {
	/**
	 * @type {number}
	 * @default undefined
	 * @required
	 */
	number1: Config.number().required(),

	/**
	 * @type {number}
	 * @default undefined
	 * @required
	 */
	number2: Config.number().required(),

	/**
	 * @type {string}
	 * @default undefined
	 * @required
	 */
	operator: Config.string().required(),

	/**
	 * @type {boolean}
	 * @default false
	 * @required
	 */
	showResult: Config.bool().value(false)
}

Operation.Main = Main;

export default Operation;
