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

function getTrips(srcLat, srcLong, dstLat, dstLong) {
  fetch('https://api.winnipegtransit.com/v3/trip-planner.json?origin=geo/' +
    srcLat + ',' + srcLong + '&api-key='+ wtApiKey + '&destination=geo/' + dstLat + ',' + dstLong)
    .then((res) => res.json())
    .then((data) => {
      let tripHTML = '';
	  let idx=0;
	  let mintime=1000000;
	  for(let i=0; i<data.plans.length; i+=1)
	  {
		  if(data.plans[i].times.durations.total<mintime)
		  {
			  mintime = data.plans[i].times.durations.total;
			  idx = i;
		  }
	  }
	  if(data.plans[idx].segments.length>0)
	  {
		  data.plans[idx].segments.forEach(
			(segment) => {
			  if (segment.type === 'walk')
				segment.to.stop
				  ? (tripHTML +=
					  '<li><i class="fas fa-walking"></i>' + 
					  segment.type.capitalize() + 
					  ' for ' +
					  segment.times.durations.total + 
					  ' minutes to stop #' +
					  segment.to.stop.key + 
					  ' - ' +
					  segment.to.stop.name)
				  : (tripHTML +=
					  '<li><i class="fas fa-walking"></i>' + 
					  segment.type.capitalize() +
					  ' for ' +
					  segment.times.durations.total +
					  ' minutes to your destination.');
			  else {
				if (segment.type === 'ride')
				  segment.route.key === 'BLUE' 
					? (tripHTML +=
						'<li><i class="fas fa-bus"></i>' + 
						segment.type.capitalize() + 
						' the ' +
						segment.route.key + 
						' for ' +
						segment.times.durations.total + 
						' minutes.')
					: (tripHTML +=
						'<li><i class="fas fa-bus"></i>' +
						segment.type.capitalize() + 
						' the ' +
						segment.route.name + 
						' for ' +
						segment.times.durations.total + 
						' minutes.');
				else
				  segment.type === 'transfer' && 
					(tripHTML +=
					  '<li><i class="fas fa-ticket-alt"></i>' +  
					  segment.type.capitalize() + 
					  ' from stop #' +
					  segment.from.stop.key + 
					  ' - ' +
					  segment.from.stop.name + 
					  ' to stop #' +
					  segment.to.stop.key + 
					  ' - ' +
					  segment.to.stop.name); 
			  }
			}
		  );
		  document.querySelector('.my-trip').innerHTML = tripHTML;
	  }
	  else{
		  document.querySelector('#mywarn').innerText="no trip Found!";
	  }
    });
}

function locationsQuery(_place, _element) {
  fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/' + _place + '.json?access_token=' + apiKey + '&limit=10&bbox=' + bbox)
    .then((res) => res.json())
    .then((data) => {
      let locHTML = '';
	  if(data.features.length>0)
	  {
		  data.features.forEach(
			(feature) => {
			const plname = feature.place_name.split(',');
			locHTML +=
			  '<li data-long="' +
			  feature.geometry.coordinates[0] +
			  '" data-lat="' +
			  feature.geometry.coordinates[1] +
			  '">\x0a          <div class="name">' +
			  plname[0].capitalize() +
			  '</div>\x0a          <div>' +
			  plname[1] +
			  '</div>\x0a        </li>';
		  });
		  _element.innerHTML = locHTML;
	  }
	  else{
		  document.querySelector('#mywarn').innerText="not Found "+_place;
	  }
    });
}

function selectLocation(_event) {
  liCtrl = _event.target.closest('li');
  if (liCtrl !== null) {
    allLi = liCtrl.parentElement.querySelectorAll('li');
  for (const liNode of allLi) {
    liNode.classList.remove('selected');
  }
  liCtrl.classList.toggle('selected');
  }
}

function formEvent(_element, _event)
{
  _event.preventDefault();
  const plInput = _event.target.querySelector('input');
  if(plInput.value !== '')
  {
    locationsQuery(plInput.value, _element);
  }
}

startingLocationsElement.onclick = selectLocation;

destinationsElement.onclick = selectLocation;

originForm.onsubmit = function (_event)
{
    formEvent(startingLocationsElement, _event);
};

destinationForm.onsubmit = function (_event)
{
    formEvent(destinationsElement, _event);
};