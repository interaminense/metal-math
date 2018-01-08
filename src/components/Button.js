import Component, {Config} from 'metal-jsx';
import {CLASSNAME} from './../Utils';

class Button extends Component {
	render() {
		return (
			<button
				{...this.otherProps()}
				class={`${CLASSNAME}-btn ${CLASSNAME}-btn--default`}>
				{this.props.children}
			</button>
		);
	}
}

export default Button;
