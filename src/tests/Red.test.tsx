import { configure, shallow } from 'enzyme';
import * as ReactSixteenAdapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import Red from '../Red';

configure({ adapter: new ReactSixteenAdapter() });


it('renders', () => {
    shallow(<Red />);
});
