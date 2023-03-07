import { getmethod } from "./helperjs/apireq.js";
import { state } from "./state.js";
import { getdetails, gethourlydata } from "./controller.js";
import {
  displaychart,
  displaydatahourly,
  displayweatherdetails,
  loading,
  showactive_card,
} from "./view.js";
import { showactivebtn } from "./view.js";

const today = document.querySelector("#today");
const tommorrow = document.querySelector("#tommorrow");
const hourlydata = document.querySelector("#hourly-data");
const choosecountry = document.querySelector("#selection");

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

  if (!state.value||!state.weathercarddata||!state.weather_data ||!state.chartdata) {
    let data = await getmethod(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=6154f8e10b3e8382c5f1896812f2903b`
    );
    state.value = data[0].name;
    choosecountry.value = "";
    let currentweather = await getmethod(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=6154f8e10b3e8382c5f1896812f2903b`
    );

    state.weathercarddata = currentweather;
    displayweatherdetails(state.weathercarddata);
    let datalist = await gethourlydata(state.default);
    state.weather_data = datalist;
    let markup = displaydatahourly(state.weather_data);
    displaychart();
    hourlydata.insertAdjacentHTML("afterbegin", markup);
    choosecountry.value = "";
    showactivebtn(state.default);
  }
   else {
    displayweatherdetails(state.weathercarddata);
    let markup = displaydatahourly(state.weather_data);
    displaychart();
    let checkcurrentcity=[ "Pune","Delhi","Goa","Hyderabad"]
    if (!checkcurrentcity.includes(state.value)) {
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
  let detailsdata;
  let displaydata;
  let newmarkup ;
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

   detailsdata = await getdetails(state.value);
  state.weathercarddata = detailsdata;
  localStorage.setItem("weathercarddata", JSON.stringify(detailsdata));
loading(hourlydata)
   displaydata = await gethourlydata("today");

  state.weather_data = displaydata;

  localStorage.setItem("weather_data", JSON.stringify(displaydata));

  localStorage.setItem("default", JSON.stringify("today"));

  displayweatherdetails(state.weathercarddata);
  displaychart();
  newmarkup = displaydatahourly(state.weather_data);

  showactivebtn("today");
  hourlydata.insertAdjacentHTML("afterbegin", newmarkup);
});
// ***********************

// Click events to show today weather data
today.addEventListener("click", async function (e) {
  let parent = e.target;
  if(!parent)return
  let filterby = parent.dataset.filter;
  let newmarkup;
  loading(hourlydata)
  let displaydata = await gethourlydata(filterby);
  localStorage.setItem("weather_data", JSON.stringify(displaydata));
  localStorage.setItem("default", JSON.stringify("today"));
  state.weather_data = displaydata;

  showactivebtn("today");

  displaychart();

  newmarkup = displaydatahourly(state.weather_data);

  hourlydata.insertAdjacentHTML("afterbegin", newmarkup);
});

// Click events to show tomorrow weather data
tommorrow.addEventListener("click", async function (e) {
  let filterby;
  let displaydata;
  let newmarkup;
 const parent = e.target;

  if (!parent) return;

  filterby = parent.dataset.filter;
loading(hourlydata)
  displaydata = await gethourlydata(filterby);

  localStorage.setItem("weather_data", JSON.stringify(displaydata));

  localStorage.setItem("default", JSON.stringify("tomorrow"));

  state.weather_data = displaydata;
  displaychart();
  showactivebtn("tomorrow");
  newmarkup = displaydatahourly(state.weather_data);
  hourlydata.insertAdjacentHTML("afterbegin", newmarkup);
});

// click event to show weatherdata in card
hourlydata.addEventListener("click", (e) => {
  let element = e.target.closest(".card1");
  let id ;
  let indivisual_data ;
if(!element)return
id = +element.dataset.id;
 indivisual_data = state.weather_data.find((el) => {
    return el.dt === id;
  });
  indivisual_data.name = state.value;
  state.weathercarddata = indivisual_data;

  localStorage.setItem("weathercarddata", JSON.stringify(indivisual_data));
  displayweatherdetails(state.weathercarddata);
showactive_card()

});
