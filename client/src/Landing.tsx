import * as React from 'react';
import { Button } from 'semantic-ui-react';
import './Landing.css';

interface ILandingState {
  roomName: string;
}

interface ILandingProps {
  startGame: () => void;
  joinRoom: (name: string) => void;
}

class Landing extends React.Component<ILandingProps, ILandingState> {
  constructor(props: ILandingProps) {
    super(props);
    this.state = { roomName: '' };
    this.handleChange = this.handleChange.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.start = this.start.bind(this);
  }

  public handleChange(event: React.FormEvent<HTMLInputElement>) {
    this.setState({ roomName: event.currentTarget.value });
  }
  public joinRoom() {
    this.props.joinRoom(this.state.roomName);
  }

  public start() {
    this.joinRoom();
    this.props.startGame();
  }

  public render() {
    return (
      <div className="landing-div">
        <h1 className="landing-welcome">Welcome to Google Trends</h1>
        <div onSubmit={this.joinRoom} className="landing-connect">
          <input
            type="text"
            placeholder="Room name"
            value={this.state.roomName}
            onChange={this.handleChange}
          />
          <Button
            className="landing-button"
            content="Connect"
            size="huge"
            basic={true}
            color="grey"
            inverted={true}
            onClick={this.start}
            type="submit"
          />
        </div>
      </div>
    );
  }
}

export default Landing;
