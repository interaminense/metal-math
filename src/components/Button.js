import Component, {Config} from 'metal-jsx';
import {CLASSNAME} from './../Utils';

class Button extends Component {
	classActive() {
		return this.props.isActive ? `${CLASSNAME}-btn--active` : '';
	}

	render() {
		return (
			<button
				{...this.otherProps()}
				class={`
					${CLASSNAME}-btn
					${this.classActive()}
					${CLASSNAME}-btn--${this.props.className}
				`}>
				{this.props.children}
			</button>
		);
	}
}

Button.PROPS = {
	isActive: Config.bool().value(false),
	className: Config.oneOf([
		'primary',
		'default'
	]).value('default')
};

export default Button;
