import {
    slider
} from './tileSlider';
import {
    addObservers
} from './observers';
import { tileClickHandler } from './modalAdder';
import '../scss/main.scss';
import '../web-components/ms-menu/ms-menu';
import '../web-components/ms-modal/ms-modal';
import '../web-components/ms-booking/ms-booking';
import '@fortawesome/fontawesome-free/js/all.js';

slider();
addObservers();
tileClickHandler();
/* global console module */
module.hot.accept((err) => console.log(err));