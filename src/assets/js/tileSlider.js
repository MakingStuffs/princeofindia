import {msQueryAll, msQuery} from 'making-stuffs-queries';
export const slider = () => {
    const elems = msQueryAll('.slidable');
    elems.forEach(elem => {
        elem.addEventListener('click', elemSlide);
        elem.addEventListener('keydown', elemSlide);
    });
    function elemSlide(e){
        if(e.key && e.key === 'Enter' || !e.key) {
            let text = msQuery(['.text'], this);
            return text.style.marginTop !== '2rem' ?
            text.style.marginTop = '2rem' : 
            text.style.marginTop = '-30%';
        } else {
            return;
        }
    }
}