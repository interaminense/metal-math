import Component from 'metal-jsx';
import Mathematics from './components/Mathematics';

class App extends Component {
	render() {
		return (
			<Mathematics
				lvlDefault={'normal'}
				lvls={[
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
				]}
				showResult={false}
				time={30}
			/>
		);
	}
}

export { App };
export default App;
