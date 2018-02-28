import Component, {Config} from 'metal-jsx';
import getCN from 'classnames';

class Button extends Component {
	/**
	 * Lifecycle MetalJS
	 * @inheritdoc
	 */
	render() {
		const {children, isActive, style} = this.props;
		const classes = getCN(
			'mathematics-btn',
			{
				['mathematics-btn--active']: isActive,
				[`mathematics-btn--${style}`]: style
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
	 * Sets the Button's color style
	 * @type {string}
	 * @default 'default'
	 */
	style: Config.oneOf(['primary','default']).value('default')
};

export default Button;
