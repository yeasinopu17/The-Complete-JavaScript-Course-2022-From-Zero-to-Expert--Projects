const icons = new URL('../img/icons.svg', import.meta.url);
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const renderSpinner = (parentEl) => {
    const markup = `
    <div class="spinner">
        <svg>
            <use href="${icons}#icon-loader"></use>
        </svg>
    </div>
    `;
    parentEl.innerHTML = '';
    parentEl.insertAdjacentHTML('afterbegin', markup);
};

const showRecipe = async () => {
    try {
        const id = window.location.hash.slice(1); //5ed6604591c37cdc054bc886
        renderSpinner(recipeContainer);
        if (!id) return;

        // 1) loading recipe
        await model.loadRecipe(id);

        // 2) Rendering recipe
        recipeView.render(model.state.recipe);

        
    } catch (error) {
        alert(error);
        console.log(error);
    }
};
showRecipe();

['hashchange', 'load'].forEach((e) => window.addEventListener(e, showRecipe));
