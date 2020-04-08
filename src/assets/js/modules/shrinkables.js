/* global */
import { msQueryAll, msQuery } from 'making-stuffs-queries';

const shrinkables = msQueryAll('.shrinkable');

shrinkables.forEach(shrinkable => {
    shrinkable.addEventListener('click', function () { 
        const textBox = msQuery('.shrink-this', this);
        textBox.classList.toggle('shrink');
    });
});