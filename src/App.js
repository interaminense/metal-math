import Component from 'metal-jsx';
import Mathematics from './components/Mathematics';

class App extends Component {
	render() {
		const {lvlDefault, lvls, showResult, countdown} = this.state;

		return (
			<Mathematics
				countdown={countdown}
				lvlDefault={lvlDefault}
				lvls={lvls}
				showResult={showResult} />
		);
	}
}

App.STATE = {
	countdown: {
		value: 30
	},
	lvlDefault: {
		value: 'normal'
	},
	lvls: {
		value: [
			{
				internalLabel: 'easy',
				label: '😸 easy',
				maxNumber: 3,
				operators: [
					{ label: '+', },
					{ label: '-', }
				]
			},
			{
				internalLabel: 'normal',
				label: '🧠 normal',
				maxNumber: 5,
				operators: [
					{ label: '+', },
					{ label: '-', },
					{ label: 'x', }
				]
			},
			{
				internalLabel: 'hard',
				label: '💀 hard',
				maxNumber: 10,
				operators: [
					{ label: '+', },
					{ label: '-', },
					{ label: 'x', }
				]
			}
		]
	},
	showResult: {
		value: false
	}
}

export { App };
export default App;
