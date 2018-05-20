import * as React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Grid } from 'semantic-ui-react'

class Red extends React.Component {
    public render() {
        return (
	    <div className="container red">
		<Grid rows={3} columns={3} centered={true}>
		    <Grid.Row />
		    <Grid.Row verticalAlign="middle">
			<Grid.Column />
			<Grid.Column textAlign="center">
			    <div className="content">
				<h1>
				    Team 1
				</h1>
				<h2>
				    Points: 0
				</h2>
			    </div>
			</Grid.Column>
			<Grid.Column />
		    </Grid.Row>
		    <Grid.Row/>

		</Grid>
	    </div>
        );
    }
}

export default Red;
