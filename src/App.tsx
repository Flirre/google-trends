import * as React from 'react';
import 'semantic-ui-css/semantic.min.css';
import './App.css';
import Blue from './Blue';
import Red from './Red';

class App extends React.Component<any, any> {
    constructor(props: any) {
	super(props);
	this.switch = this.switch.bind(this);
	this.state = { red: true, text: "abc" };
    }

    public switch() {
	    this.setState({red: !this.state.red});
    }

    public render() {
        return (
	    this.state.red ?
            < Red switch = {this.switch} /> :
	    < Blue switch = {this.switch} />
        );
    }
}

export default App;
