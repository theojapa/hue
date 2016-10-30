const hue = require('node-hue-api');

const { HueApi, lightState } = hue;
const hostname = '10.0.1.24';
const username = 'jaZugIS7B0DAXbaDRa-6l5wlKdRvNa9cfA5GJ3lE';

const api = new HueApi(hostname, username);

// api.config().then(config => console.log(config));

api.lights()
  .then(response => {
    const lights = response.lights.reduce((reduction, l) => {
      reduction[l.name] = l;
      return reduction;
    }, {});

    const names = Object.keys(lights);
    const allLights = names.map(name => lights[name]);

    console.log(`Lights: ${names.join(', ')}`);

    flames(lights.Porch);
    lightning(lights.Fireplace, lights.Vodka, lights.Bedroom, lights.Moon);
    // randomColors(...allLights);
  });

function flames(...lights) {
  function frame() {
    const state = lightState.create().on()
      .hue(0 + Math.floor(Math.random() * 3000))
      .sat(255)
      .brightness(Math.floor(Math.random() * 200))
      .transitiontime(2);

    lights.forEach(({ id }) => api.setLightState(id, state));
  }

  global.setInterval(frame, 250);
}

function lightning(...lights) {
  let flash = false; // true when the lighting is "on"

  function frame() {
    flash = !flash;

    const state = lightState.create().on()
      .hue(0)
      .sat(255)
      .brightness(flash ? 255 : 0)
      .transitiontime(2);

    lights.forEach(({ id }) => api.setLightState(id, state));

    const delay = Math.floor(Math.random() * (flash ? 500 : 4000));
    global.setTimeout(frame, delay);
  }

  frame();
}

function randomColors(...lights) {
  function frame() {
    const state = lightState.create().on()
      .hue(Math.floor(Math.random() * 65535))
      .sat(255)
      .brightness(255)
      .transitiontime(10);

    lights.forEach(({ id }) => api.setLightState(id, state));
  }

  global.setInterval(frame, 1000);
}
