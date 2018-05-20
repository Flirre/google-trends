import * as React from 'react';
import Red from '../Red';
import { shallow, configure } from 'enzyme';
import * as ReactSixteenAdapter from 'enzyme-adapter-react-16';

configure({ adapter: new ReactSixteenAdapter() });


it('renders', () => {
    shallow(<Red />);
});
