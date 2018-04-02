import Component, {Config} from 'metal-jsx';
import getCN from 'classnames';
import {CLASSNAME} from '../utils/utils';

class Button extends Component {
	/**
	 * Lifecycle MetalJS
	 * @inheritdoc
	 */
	render() {
		const {children, isActive, size, style} = this.props;
		const classes = getCN(
			`${CLASSNAME}-btn`,
			{
				[`${CLASSNAME}-btn--active`]: isActive,
				[`${CLASSNAME}-btn--${size}`]: size,
				[`${CLASSNAME}-btn--${style}`]: style
			}
		);

		return (
			<button {...this.otherProps()} class={classes}>
				{children}
			</button>
		);
	}
}

Button.PROPS = {
	/**
	 * Adds the classname 'mathematics-btn--active'
	 * to Button
	 * @type {boolean}
	 * @default false
	 */
	isActive: Config.bool().value(false),

	/**
	 * Adds size to the button
	 * @type {string}
	 * @default 'md'
	 */
	size: Config.oneOf(['sm', 'md']).value('md'),

	/**
	 * Sets the Button's color style
	 * @type {string}
	 * @default 'default'
	 */
	style: Config.oneOf(['primary','default']).value('default')
};

export default Button;
