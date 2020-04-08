import {
    msQueryAll,
    msCreate,
    msQuery
} from 'making-stuffs-queries';
export const tileClickHandler = async () => {

    const tiles = msQueryAll('.img-tile');
    tiles.forEach(tile => {
        tile.addEventListener('click', clickHandler);
    });

    function clickHandler() {
        const modal = msCreate('ms-modal');
        const template = msQuery('.template', this).cloneNode(true);
        template.classList.remove('template');
        template.classList.add('wrapper');

        modal.appendChild(template);
        document.body.appendChild(modal);
    }
};