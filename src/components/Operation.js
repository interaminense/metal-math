import Component, {Config} from 'metal-jsx';
import {CLASSNAME, CALCULATE} from './../Utils.js';

const Main = (props) => {
	return <div class={`${CLASSNAME}__operation`}>{props.children}</div>;
};

class Operation extends Component {
	/**
	 * Lifecycle MetalJS
	 * @inheritdoc
	 */
	render() {
		const {number1, number2, operator, showResult} = this.props;
		const result = CALCULATE(number1, number2, operator);

		return (
			<Operation.Main>
				{`${number1} ${operator} ${number2}${showResult ? `= ${result}` : ''}`}
			</Operation.Main>
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
