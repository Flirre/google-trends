import * as React from 'react';
import { Button } from 'semantic-ui-react';
import './Landing.css';

class Landing extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
      <div className="landing-div">
        <h1 className="landing-welcome">Welcome to Google Trends</h1>
        <Button
          className="landing-button"
          content="Start game"
          size="huge"
          basic={true}
          color="grey"
          inverted={true}
          onClick={this.props.startGame}
        />
      </div>
    );
  }
}

export default Landing;
