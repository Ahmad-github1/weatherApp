let totalCartona = "";
let cityNameInput = document.getElementById('search');
let errDiv = document.getElementById('errDiv');


cityNameInput.addEventListener('input', function () { 
  let term = cityNameInput.value.trim();
  forecast(term); // fetch term data
 });


 // in jS browser is represented by the navigator object have properties and methods
 if ("geolocation" in navigator) { // geolocation API supported or not
  console.log("Geolocation is supported in this browser.");
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      const location = `${latitude},${longitude}`;
      //console.log(location);
      forecast(location);

    }
  );
} else {
  console.log("Geolocation is not supported in this browser.");
}


 /* // Dont need as forcast API return location & current & forcast 
async function current (term) {

  try {
    errDiv.classList.add('d-none');
    // return Promise and Response object 
    // options / {method:'GET'} by default
    let response = await fetch (`http://api.weatherapi.com/v1/current.json?key=a927d8930e854e68917161026241312&q=${term}`);
    if (response.ok) {
      let data = await response.json(); // return Promise should await for this 
      console.log(data);
    }
  }catch {
    errDiv.classList.remove('d-none');
  }
}
*/


async function forecast (term) {
  try {
    errDiv.classList.add('d-none');
    let url = `https://api.weatherapi.com/v1/forecast.json?key=a927d8930e854e68917161026241312&q=${term}&days=3&aqi=yes&alerts=no`;
    let response = await fetch (url);
    
    if (response.ok) {

      let data = await response.json(); // return Promise should await for this 
      //console.log(data);

      totalCartona = ""; // Reset the container to update with new data
      displayCurrent(data); 
      displayForecast(data); 
      //console.log(totalCartona); // log total accumulated HTML

      // Update the HTML content of the fetchedData container
      document.getElementById('fetchedData').innerHTML = totalCartona;
    } 
  } catch (error) { //catch receive an error object if happend inside try block.
    errDiv.classList.remove('d-none');
    console.log(error.stack); // Points to the exact line
  }
}


function displayCurrent(data) { //parameters

  let cartonaCurrent = "";
  let currentDayName  = reformatDate (data.current.last_updated, 'dayName'); // arguments passed to the function
  let currentDayMonth = reformatDate (data.current.last_updated, 'dayMonth'); 

    cartonaCurrent = `
      <div class="col-md-4  mybg1">
      <div class="d-flex justify-content-between p-1 card-header w-100">
        <div>${currentDayName}</div>
        <div>${currentDayMonth}</div>
      </div>
      <div class="my-card p-4">
        <div>${data.location.name}</div>
        <div class="degree">
          <div class="num">${data.current.temp_c}<sup>o</sup>C</div>
        
          <div class="forecast-icon">
              <img src="${data.current.condition.icon}" alt="" width="90">
          </div>
          <div class="custom">${data.current.condition.text}</div>
        </div>  
      </div>
    </div>`
    
  totalCartona += cartonaCurrent;
}


function displayForecast (data) { 
  let cartonaForecast = "";

   for ( i = 1; i < data.forecast.forecastday.length; i++ ) { // need only 2 iterations of 3
    
    let nextDayName = reformatDate(data.forecast.forecastday[i].date, 'dayName'); // arguments passed to the function
    let nextDayMonth = reformatDate(data.forecast.forecastday[i].date, 'dayMonth');  
    
    cartonaForecast += `
      <div class="col-md-4 text-center  mybg2">
        <div class="d-flex justify-content-between p-1 card-header">
          <div>${nextDayName}</div>
          <div>${nextDayMonth}</div>
        </div>
        <div class="my-card p-4">
          <div>${data.location.name}</div>
           <div class="forecast-icon">
                <img src="${data.forecast.forecastday[i].day.condition.icon}" alt="" width="90">
            </div>
          <div class="degree">
            <div class="max-temp">${data.forecast.forecastday[i].day.maxtemp_c}<sup>o</sup>C</div>
            <div class="min-temp">${data.forecast.forecastday[i].day.mintemp_c}<sup>o</sup>C</div>
            <div class="custom">${data.forecast.forecastday[i].day.condition.text}</div>
          </div>  
        </div>
      </div>`
   }
   totalCartona += cartonaForecast;
}




function reformatDate(dateString, returnType) {

  /*
  let date = new Date ('2024-12-15 22:15');
  console.log(date.getDate());      //15  return Day of the month (1–31)
  console.log(date..getDay());      // 0  return Day of week (0-6; 0 = sunday)
  console.log(date.getMonth());     //11  return Month (0–11; 0 = January)
  console.log(date.getFullYear()); //2024 
  */

  // Create a Date object from taking parameter 
  let date = new Date(dateString); 

  // Map numbers to monthNames
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Map numbers to day names
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = date.getDate();
  let dayName   = daysOfWeek[date.getDay()];
  let monthName = monthNames[date.getMonth()];

  if ( returnType === 'dayName') {
    return `${dayName}`;
  }
  else if ( returnType === 'dayMonth') {
    return `${day} ${monthName}`;
  }
}
