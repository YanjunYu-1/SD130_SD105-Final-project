import {apiKey, bbox, wtApiKey} from './modules/rul.js'
import {originForm,destinationForm,startingLocationsElement,destinationsElement,planTripButton} from './modules/node.js'

startingLocationsElement.innerHTML='';
destinationsElement.innerHTML='';

document.querySelector('.my-trip').innerHTML = '';
document.querySelector('.my-trip').insertAdjacentHTML(
        'afterbegin',
		`<div id="mywarn" style="color:#F00"></div>`
);

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};