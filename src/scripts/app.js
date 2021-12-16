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