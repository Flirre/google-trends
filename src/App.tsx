import * as React from 'react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import Blue from './Blue';
import Red from './Red';

class App extends React.Component<any, any> {
    constructor(props: any) {
	super(props);
	this.switch = this.switch.bind(this);
	this.incrementTeam1 = this.incrementTeam1.bind(this);
	this.incrementTeam2 = this.incrementTeam2.bind(this);
	this.state = { red: true, team1: 0, team2: 0 };
    }

    public switch() {
	    this.setState({red: !this.state.red});
    }

    public incrementTeam1() {
	this.setState((prevState: any, props: any) => ({
	    team1: prevState.team1 + 1
	}));
    }

    public incrementTeam2() {
	this.setState((prevState: any, props: any) => ({
	    team2: prevState.team2 + 1
	}));
    }

    public render() {
        return (
	    this.state.red ?
            < Red switch = {this.switch} points = {this.state.team1} increment={this.incrementTeam1} /> :
	    < Blue switch = {this.switch} points = {this.state.team2} increment={this.incrementTeam2} />
        );
    }
}

export default App;
