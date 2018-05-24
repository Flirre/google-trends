import { configure, shallow } from 'enzyme';
import * as ReactSixteenAdapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import Blue from '../Blue';

configure({ adapter: new ReactSixteenAdapter() });


it('renders', () => {
    shallow(<Blue />);
});
