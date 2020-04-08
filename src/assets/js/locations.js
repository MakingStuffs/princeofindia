import {
    addObservers
} from './modules/observers';
import {
    tileClickHandler
} from './modules/modalAdder';
import '../web-components/ms-modal/ms-modal';
import '../scss/main.scss';
import '@fortawesome/fontawesome-free/js/all.js';

addObservers();
tileClickHandler();