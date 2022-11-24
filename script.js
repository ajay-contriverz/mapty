'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
let map, mapEvent;
const workouts = []
navigator.geolocation.getCurrentPosition(
    function(position){
    const {latitude} = position.coords;
    const {longitude} = position.coords;
    const coords = [latitude, longitude]
    map = L.map('map').setView(coords, 14);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

    map.on("click", function(mapE){
        mapEvent = mapE;
        form.classList.remove("hidden")
        inputDistance.focus();
    })
    
    },
    function(){
        alert("Could not got your loacation")
    }
);

form.addEventListener("submit", function(e){
    e.preventDefault();
    const {lat, lng} = mapEvent.latlng;
    workouts.push({
        lat: lat, 
        lng: lng, 
        type: inputType.value, 
        distance: inputDistance.value, 
        duration: inputDuration.value, 
        cadence: inputCadence.value,
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
    })
    containerWorkouts.innerHTML = ""
    workouts.forEach(function(workout){
        const workoutHTml = `
            <li class="workout workout--running" data-id="1234567890">
                <h2 class="workout__title">${workout.type === "running" ? "Running" : "Cycling"} on ${workout.month} ${workout.day}</h2>
                <div class="workout__details">
                <span class="workout__icon">${workout.type === "running" ? "🏃‍♂️" : "🚲"}</span>
                <span class="workout__value">${workout.distance}</span>
                <span class="workout__unit">km</span>
                </div>
                <div class="workout__details">
                <span class="workout__icon">⏱</span>
                <span class="workout__value">${workout.duration}</span>
                <span class="workout__unit">min</span>
                </div>
                <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${Math.trunc(workout.duration / workout.distance)}</span>
                <span class="workout__unit">min/km</span>
                </div>
                <div class="workout__details">
                <span class="workout__icon">${workout.type === "running" ? "🦶🏼" : "⛰"}</span>
                <span class="workout__value">${workout.cadence}</span>
                <span class="workout__unit">${workout.type === "running" ? "spm" : "m"}</span>
                </div>
            </li>
        `;
        containerWorkouts.insertAdjacentHTML("beforeend", workoutHTml);
        L.marker([workout.lat, workout.lng]).addTo(map).bindPopup(
        L.popup({
            autoClose: false,
            closeOnClick: false,
            className: "running-popup"
        })
        )
        .setPopupContent(`Type: ${workout.type}, distance: ${workout.distance}, duration: ${workout.duration}, cadence: ${workout.cadence}`)
        .openPopup();
    })
    
    form.classList.add("hidden")
})