// expand topic at page load
window.addEventListener(`DOMContentLoaded`, () => {
    const hash = window.location.hash.slice(1);
    if (hash) {
        const category = document.getElementById(hash);
        if (category && category.tagName.toLowerCase() === `details`) {
            category.open = true;
            category.scrollIntoView();
        }
    }
});