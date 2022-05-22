'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
    date = new Date();
    id = (Date.now() + '').slice(0);
    click = 0;

    constructor(coords, distance, duration) {
        this.coords = coords; //[lat, lng]
        this.distance = distance; //in km
        this.duration = duration; // in minute
    }

    _setDescription() {
        // prettier-ignore
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
            months[this.date.getMonth()]
        } ${this.date.getDate()}`;
    }

    clicks() {
        this.click++;
    }
}

class Running extends Workout {
    type = 'running';

    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this.calcPace();
        this._setDescription();
    }
    calcPace() {
        // min/km
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}

class Cycling extends Workout {
    type = 'cycling';

    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this.calcSpeed();
        this._setDescription();
    }
    calcSpeed() {
        // km /hr
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
}

// const run1 = new Running([23, 90], 5.2, 24, 178);
// const cycling1 = new Cycling([23, 90], 27, 95, 523);
// console.log(run1, cycling1);

///////////////////////////
// APPLICATION ARCHITECTURE
///////////////////////////
class App {
    #map;
    #mapEvent;
    #mapZoomLevel = 15;
    #workouts = [];

    constructor() {
        // get user's position
        this._getPosition();

        // Get data from local storage
        this._getLocalStorage();

        //Attach event handlers
        form.addEventListener('submit', this._newWorkout.bind(this));
        inputType.addEventListener('change', this._toogleElevationField);
        containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
    }
    _getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
                alert('Could not get your location.');
            });
        }
    }
    _loadMap(position) {
        const { latitude, longitude } = position.coords;
        console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

        const coords = [latitude, longitude];

        this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.#map);

        // handling clicks on map
        this.#map.on('click', this._showForm.bind(this));

        // load previous marker
        this.#workouts.forEach((work) => {
            this._renderWorkoutMarker(work);
        });
    }

    _hideForm() {
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
        form.style.display = 'none';
        form.classList.add('hidden');
        setTimeout(() => (form.style.display = 'grid'), 1000);
    }

    _showForm(mapE) {
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
    }

    _toogleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout(e) {
        const validInputs = (...inputs) => inputs.every((val) => Number.isFinite(val));
        const allPositive = (...numbers) => numbers.every((num) => num > 0);

        e.preventDefault();

        // get data from form
        const type = inputType.value;
        const distance = +inputDistance.value;
        const duration = +inputDuration.value;
        const { lat, lng } = this.#mapEvent.latlng;
        let workout;

        //check activity , if running then
        if (type === 'running') {
            const cadence = +inputCadence.value;
            //check data validity
            if (!validInputs(distance, duration, cadence) || !allPositive(distance, duration, cadence))
                return alert('Invalid Number...');

            workout = new Running([lat, lng], distance, duration, cadence);
        }

        //check activity , if cycling then
        if (type === 'cycling') {
            const elevation = +inputElevation.value;
            //check data validity
            if (!validInputs(distance, duration, elevation) || !allPositive(distance, duration))
                return alert('Invalid Number...');

            workout = new Cycling([lat, lng], distance, duration, elevation);
        }

        //add new obj to workout array
        this.#workouts.push(workout);
        console.log(this.#workouts);

        //render workout as marker
        this._renderWorkoutMarker(workout);

        // finally render workout to the lists
        this._renderWorkout(workout);

        //clear input field + hide the form
        this._hideForm();

        // set local storage to all workout
        this._setLocalStorage();
    }

    _renderWorkoutMarker(workout) {
        L.marker(workout.coords)
            .addTo(this.#map)
            .bindPopup(
                L.popup({
                    autoClose: false,
                    maxWidth: 250,
                    minWidth: 100,
                    closeOnClick: false,
                    className: `${workout.type}-popup`,
                })
            )
            .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♂️'} ${workout.description}`)
            .openPopup();
    }

    _renderWorkout(workout) {
        let html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♂️'}</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
        `;
        if (workout.type === 'running') {
            html += `
            <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${workout.pace.toFixed(1)}</span>
                <span class="workout__unit">min/km</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">🦶🏼</span>
                <span class="workout__value">${workout.cadence}</span>
                <span class="workout__unit">spm</span>
            </div>
        </li>`;
        }

        if (workout.type === 'cycling') {
            html += `
           <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">223</span>
            <span class="workout__unit">m</span>
          </div>
        </li>`;
        }
        form.insertAdjacentHTML('afterend', html);
    }

    _moveToPopup(e) {
        const workoutEl = e.target.closest('.workout');
        if (!workoutEl) return;

        const workout = this.#workouts.find((work) => work.id === workoutEl.dataset.id);
        this.#map.setView(workout.coords, this.#mapZoomLevel, { animate: true, pan: { duration: 1 } });

        // workout.clicks();
    }

    _setLocalStorage() {
        localStorage.setItem('workouts', JSON.stringify(this.#workouts));
    }

    _getLocalStorage() {
        const data = JSON.parse(localStorage.getItem('workouts'));

        if (!data) return;

        this.#workouts = data;

        this.#workouts.forEach((w) => {
            this._renderWorkout(w);
        });
    }

    reset() {
        localStorage.removeItem('workouts');
        location.reload();
    }
}

const app = new App();