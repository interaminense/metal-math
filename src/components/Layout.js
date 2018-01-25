import Component, {Config} from 'metal-jsx';
import {CLASSNAME} from './../Utils';

const Header = (props) => {
	return <div class={`${CLASSNAME}__layout-header`}>{props.children}</div>
}
const Body = (props) => {
	return <div class={`${CLASSNAME}__layout-body`}>{props.children}</div>
}
const Footer = (props) => {
	return <div class={`${CLASSNAME}__layout-footer`}>{props.children}</div>
}

class Layout extends Component {
	/**
	 * Lifecycle MetalJS
	 * @inheritdoc
	 */
	render() {
		return(
			<div class={`${CLASSNAME}__layout`}>
				{this.props.children}
			</div>
		);
	}
}

Layout.Header = Header;
Layout.Body = Body;
Layout.Footer = Footer;

export default Layout;
