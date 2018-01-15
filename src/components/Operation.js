import Component, {Config} from 'metal-jsx';
import {CLASSNAME, CALCULATE} from './../Utils.js';

const Main = (props) => {
	return <div class={`${CLASSNAME}__operation`}>{props.children}</div>;
};

class Operation extends Component {
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
	number1: Config.number().required(),
	number2: Config.number().required(),
	operator: Config.string().required(),
	showResult: Config.bool().value(false)
}

Operation.Main = Main;

export default Operation;
