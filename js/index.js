import { getmethod } from "./helperjs/apireq.js";
import { state } from "./state.js";
import { getdetails, gethourlydata } from "./controller.js";
import {
  displaychart,
  displaydatahourly,
  displayweatherdetails,
} from "./view.js";
import { showactivebtn } from "./view.js";

let today = document.querySelector("#today");
let tommorrow = document.querySelector("#tommorrow");
let hourlydata = document.querySelector("#hourly-data");
let choosecountry = document.querySelector("#selection");

// As file loades

window.addEventListener("load", async () => {
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  getLocation();
});

// *************************

async function showPosition(position) {
  let lat = position.coords?.latitude;
  let lon = position.coords?.longitude;

  if (!state.value) {
    let data = await getmethod(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=6154f8e10b3e8382c5f1896812f2903b`
    );
    state.value = data[0].name;
    choosecountry.value = "";
  }
  if (!state.weathercarddata) {
    let data = await getmethod(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=6154f8e10b3e8382c5f1896812f2903b`
    );

    state.weathercarddata = data;
    displayweatherdetails(state.weathercarddata);
  } else {
    displayweatherdetails(state.weathercarddata);
  }

  if (!state.weather_data || !state.chartdata) {
    let datalist = await gethourlydata(state.default);
    state.weather_data = datalist;
    let markup = displaydatahourly(state.weather_data);
    displaychart();
    hourlydata.insertAdjacentHTML("afterbegin", markup);
    choosecountry.value = "";
    showactivebtn(state.default);
  } else {
    let markup = displaydatahourly(state.weather_data);
    displaychart();
    if (
      state.value !== "Pune" &&
      state.value !== "Delhi" &&
      state.value !== "Goa" &&
      state.value !== "Hyderabad"
    ) {
      choosecountry.value = "";
    } else {
      choosecountry.value = state.value;
    }

    hourlydata.insertAdjacentHTML("afterbegin", markup);
    showactivebtn(state.default);
  }
}

// Click event by country name
choosecountry.addEventListener("change", async (e) => {
  hourlydata.innerHTML = "";
  if (e.target.value) {
    state.value = e.target.value;
  } else {
    displayweatherdetails(state.weathercarddata);
    let markup = displaydatahourly(state.weather_data);
    displaychart();
    hourlydata.insertAdjacentHTML("afterbegin", markup);
    return;
  }
  localStorage.setItem("value", JSON.stringify(state.value));
  let data = await getdetails(state.value);
  state.weathercarddata = data;
  localStorage.setItem("weathercarddata", JSON.stringify(data));
  // localStorage.setItem("default",JSON.stringify("today"))
  let displaydata = await gethourlydata("today");

  state.weather_data = displaydata;
  displaychart();
  localStorage.setItem("weather_data", JSON.stringify(displaydata));

  localStorage.setItem("default", JSON.stringify("today"));

  displayweatherdetails(state.weathercarddata);

  let newmarkup = displaydatahourly(state.weather_data);

  showactivebtn("today");
  hourlydata.insertAdjacentHTML("afterbegin", newmarkup);
});
// ***********************

// Click events to show today weather data
today.addEventListener("click", async function (e) {
  hourlydata.innerHTML = "";
  let parent = e.target;
  showactivebtn("today");
  let filterby = parent.dataset.filter;

  let displaydata = await gethourlydata(filterby);
  localStorage.setItem("weather_data", JSON.stringify(displaydata));
  localStorage.setItem("default", JSON.stringify("today"));
  state.weather_data = displaydata;
  displaychart();
  let newmarkup = displaydatahourly(state.weather_data);
  ("today");
  hourlydata.insertAdjacentHTML("afterbegin", newmarkup);
});

// Click events to show tomorrow weather data
tommorrow.addEventListener("click", async function (e) {
  hourlydata.innerHTML = "";

  let parent = e.target;

  if (!parent) return;

  let filterby = parent.dataset.filter;

  let displaydata = await gethourlydata(filterby);

  localStorage.setItem("weather_data", JSON.stringify(displaydata));

  localStorage.setItem("default", JSON.stringify("tomorrow"));

  state.weather_data = displaydata;
  displaychart();
  let newmarkup = displaydatahourly(state.weather_data);

  showactivebtn("tomorrow");

  hourlydata.insertAdjacentHTML("afterbegin", newmarkup);
});

// click event to show weatherdata in card
hourlydata.addEventListener("click", (e) => {
  let element = e.target.closest(".card1");

  let id = +element.dataset.id;
  let indivisual_data = state.weather_data.find((el) => {
    return el.dt === id;
  });
  indivisual_data.name = state.value;

  state.weathercarddata = indivisual_data;
  localStorage.setItem("weathercarddata", JSON.stringify(indivisual_data));
  displayweatherdetails(state.weathercarddata);
});
