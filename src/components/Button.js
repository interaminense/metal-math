import Component, {Config} from 'metal-jsx';
import {CLASSNAME} from './../utils/Utils';

class Button extends Component {
	/**
	 * Lifecycle MetalJS
	 * @inheritdoc
	 */
	render() {
		const {children, className} = this.props;

		return (
			<button
				{...this.otherProps()}
				class={`
					${CLASSNAME}-btn
					${this.getActiveClass()}
					${CLASSNAME}-btn--${className}
				`}>
				{children}
			</button>
		);
	}

	/**
	 * Return the active class
	 */
	getActiveClass() {
		return this.props.isActive ? `${CLASSNAME}-btn--active` : '';
	}
}

Button.PROPS = {
	/**
	 * @type {boolean}
	 * @default false
	 */
	isActive: Config.bool().value(false),

	/**
	 * @type {string|array}
	 * @default default
	 */
	className: Config.oneOf([
		'primary',
		'default'
	]).value('default')
};

export default Button;
