import Ember from 'ember';
import { render } from '../utils/markdown';

export default Ember.Helper.helper(function ([str]) {
    if (!str) {
        return '';
    }

    return Ember.String.htmlSafe(render(str));
});
