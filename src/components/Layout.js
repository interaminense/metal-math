import Component, {Config} from 'metal-jsx';

const Header = (props) => {
	return <div class={'mathematics__layout-header'}>{props.children}</div>
}
const Body = (props) => {
	return <div class={'mathematics__layout-body'}>{props.children}</div>
}
const Footer = (props) => {
	return <div class={'mathematics__layout-footer'}>{props.children}</div>
}

class Layout extends Component {
	/**
	 * Lifecycle MetalJS
	 * @inheritdoc
	 */
	render() {
		return(
			<div class={'mathematics__layout'}>
				{this.props.children}
			</div>
		);
	}
}

Layout.Header = Header;
Layout.Body = Body;
Layout.Footer = Footer;

export default Layout;
