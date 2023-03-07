import { gettime } from "./helperjs/helper.js";
import { state } from "./state.js";
const carddetailsparent = document.querySelector(".card-details");
const hourlydata = document.querySelector("#hourly-data");
const today = document.querySelector("#today");
const tommorrow = document.querySelector("#tommorrow");

function displayweatherdetails(data) {
  carddetailsparent.innerHTML = "";
  let weatherdata = {
    tempreature: data.main.temp,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    weather_main: data.weather[0].main,
    location: data.name,
    wind_speed: data.wind.speed,
    weather_description: data.weather[0].description,
  };

  let markup = ` <div class="card" >
  <img src=${
    weatherdata.weather_main === "Clouds"
      ? "https://cdn.pixabay.com/photo/2014/11/16/15/15/field-533541__340.jpg"
      : weatherdata.weather_main === "Clear"
      ? "https://cdn.pixabay.com/photo/2018/08/06/22/55/sun-3588618__340.jpg"
      : "https://images.news18.com/ibnlive/uploads/2021/07/1627056776_clouds.jpg"
  } class="card-img-top img-fluid" alt="...">
  <div class="card-body">
    <h3 class="card-title font-weight-bold  text-center ">Weather Details</h3>
    <div class="d-flex  card-text d-flex justify-content-between" >
      <div>
          <i class="fa-solid fa-temperature-three-quarters"></i><span  class="h3 ml-2">${
            weatherdata.tempreature
          }<span class="text-danger h1">&#176C</span></span>
      </div>
      
        <div class="sunrise">
  
        <div class="sun-img ml-auto">
          <img class="img " src=${
            weatherdata.weather_main === "Clouds"
              ? "./images/cloudy.png"
              : weatherdata.weather_main === "Clear"
              ? "./images/sun.png"
              : "./images/rainy-day.png"
          } alt="">
      </div>
       
     
      </div>
   
    </div>
    <p class="text-center h3 text-wrap font-weight-bold my-3">${
      weatherdata.weather_description
    }</p>
    <div class="other-details">
      <p class="text-monospace font-weight-bold">Humidity : <span class="font-weight-light text-muted">${
        weatherdata.humidity
      } %</span></p>
      <p class="text-monospace font-weight-bold">Wind : <span class="font-weight-light text-muted">${
        weatherdata.wind_speed
      } k/h</span></p>
      <p class="text-monospace font-weight-bold">Pressure : <span class="font-weight-light text-muted">${
        weatherdata.pressure
      } MB</span></p> 
      <P class="text-monospace font-weight-bold">Location : <span class="font-weight-light text-muted">${
        weatherdata.location
      }</span></P>
    </div>
     
    </div>
    
  
  </div>
  `;
  carddetailsparent.insertAdjacentHTML("afterbegin", markup);
}

function displaydatahourly(weatherdata) {
  hourlydata.innerHTML = "";
  return weatherdata
    .map((data) => {
      let time = data.dt_txt.split(" ")[1].split(":")[0];
      time = gettime(time);

      let weatherdata = {
        id: data.dt,
        tempreature: data.main.temp,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        weather_main: data.weather[0].main,
        weather_description: data.weather[0].description,
        location: data.name,
        wind_speed: data.wind.speed,
        time,
      };
      return `
        <div class="ml-lg-4 p-lg-3 border-5 card1 bg-dark mb-lg-4 mb-md-2 ml-md-2 p-md-2 p-sm-1  " id="card-iteam" data-id=${
          weatherdata.id
        } >
        <div class="cloud-img m-auto ">
            <img src=${
              weatherdata.weather_main === "Clouds"
                ? "./images/cloudy.png"
                : weatherdata.weather_main === "Clear"
                ? "./images/sun.png"
                : "./images/rainy-day.png"
            } class="card-img-top img" alt="...">
        </div>
        
        <div class="cart-body my-lg-3 my-md-2 my-sm-2 text-center">
        
          <p class="  h4 mb-lg-4 mb-md-2 mb-sm-1  text-light" >${
            weatherdata.tempreature
          }<span class="text-danger h2"> &#176C</span></p>
          <p class=" h3 mb-lg-4 mb-md-2 mb-sm-1  text-light">${
            weatherdata.weather_main
          }</p>
          <div class="d-flex justify-content-between"><i class="fa-regular h4 font-weight-bold text-light fa-clock"></i>  <p class="font-weight-bold h4 text-light">${
            weatherdata.time
          }</p> </div>
      
         
        
        </div>
        </div>
        </div>
        `;
    })
    .join("");
}

let displaychart = () => {
  let dataset = state.chartdata.map((el) => el.main.temp);
  var ctx = document.getElementById("myChart");
  let labels = state.chartdata.map((data) => {
    let time = data.dt_txt.split(" ")[1].split(":")[0];
    return (time = gettime(time));
  });

  

  if (state.newchart) {
    state.newchart.clear();

    state.newchart.destroy();
  }

  state.newchart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Tempreature",
          data: dataset,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.4,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 15,
              color: "black",
              weight: "bold",
            },
          },
          gridLines: {
            display: true,
            color: "#03A5C5",
            lineWidth: 8,
          },
        },
        x: {
          ticks: {
            font: {
              size: 15,
              color: "black",
              weight: "bold",
            },
          },
        },
      },
      animations: {
        tension: {
          duration: 1000,
          easing: "linear",
          from: 1,
          to: 0,
          loop: true,
        },
      },
      plugins: {
        legend: {
          labels: {
            font: {
              size: 15,
            },
          },
        },
      },
    },
  });
};

function loading(parent) {
  parent.innerHTML = "";
  let markup = `
        <div class="spinner-border text-success m-auto" style="width: 3rem; height: 3rem;"  role="status">
          <span class="sr-only">Loading...</span>
        </div>
        `;
  parent.insertAdjacentHTML("afterbegin", markup);
}

function showactivebtn(str) {
  if (str === "today") {
    today.classList.add("btn-success");
    tommorrow.classList.remove("btn-success");
  } else if (str === "tomorrow") {
    tommorrow.classList.add("btn-success");
    today.classList.remove("btn-success");
  }
}

function showactive_card(){
  const activecards=document.querySelectorAll("[data-id]")

  activecards.forEach((el)=>{
    el.classList.remove("activecard")
  })
  
state.weather_data.forEach(element => {
  if(element.dt===state.weathercarddata.dt){
let  activecard=document.querySelector(`[data-id="${element.dt}"]`)
  activecard.classList.add("activecard")
  }
 
});
}

export {
  displaydatahourly,
  displayweatherdetails,
  loading,
  showactivebtn,
  displaychart,
  showactive_card
};
