'use strict';
/* global IntersectionObserver window */
import {
    msQuery,
    msCreate
} from 'making-stuffs-queries';
export const addObservers = async () => {
    const main = msQuery('main');
    const footer = msQuery('footer');
    const callback = (entries) => {
        const nav = msQuery('nav');
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target === main) {
                nav.classList.add('scrolling');
                return;
            } else if (window.scrollY < msQuery('header').offsetHeight && !entry.isIntersecting && entry.target === main) {
                nav.classList.remove('scrolling');
                return;
            } else if (entry.isIntersecting && entry.target === footer) {
                return addMap();
            }
        });
    };

    const addMap = () => {
        const placeHolder = msQuery('.restaurant-map');
        if (placeHolder.childElementCount === 0) {
            const iFrameOptions = {
                src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2902.205710588168!2d-79.8219823848171!3d43.33088427913358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882c9fbb53585f77%3A0x4aabc3bbfa661798!2sPrince%20of%20India!5e0!3m2!1sen!2suk!4v1578477034172!5m2!1sen!2suk",
                width: "100%",
                height: "350",
                frameborder: "0",
                style: "border:0;",
                allowfullscreen: ""
            };
            const mapiFrame = msCreate('iframe', iFrameOptions);
            placeHolder.appendChild(mapiFrame);
        } else return;
    };

    let intersectionOptions = {
        root: null,
        threshold: 0.02
    };
    let observer = new IntersectionObserver(callback, intersectionOptions);
    observer.observe(main);
    observer.observe(footer);
};