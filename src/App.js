import Component from 'metal-jsx';
import Mathematics from './components/Mathematics';

class App extends Component {
	render() {
		const {lvlDefault, lvls, showResult, time} = this.state;

		return (
			<Mathematics lvlDefault={lvlDefault} lvls={lvls} showResult={showResult} time={time} />
		);
	}
}

App.STATE = {
	lvlDefault: {
		value: 'easy'
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
					{ label: 'x', },
					{ label: '÷', }
				]
			}
		]
	},
	showResult: {
		value: false
	},
	time: {
		value: 20
	}
}

export { App };
export default App;
