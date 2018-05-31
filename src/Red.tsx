import * as React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Button, Grid } from 'semantic-ui-react'

class Red extends React.Component<any> {
    constructor(props: any) {
	super(props);
    }

    public render() {
        return (
            <div className="container red">
                <Grid rows={3} columns={3}>
                    <Grid.Row verticalAlign="top">
                        <Button id="switcher" size="mini" floated="left" color="blue" content="Switch" onClick={this.props.switch} />
                    </Grid.Row>
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
                    <Grid.Row />

                </Grid>
            </div >
        );
    }

    public log() {
        // tslint:disable-next-line:no-console
        console.log("switch");
    }
}

export default Red;