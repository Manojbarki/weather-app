let state = {
  weather_data: JSON.parse(localStorage.getItem("weather_data")),
  weathercarddata:JSON.parse(localStorage.getItem("weathercarddata")),
  chartdata:JSON.parse(localStorage.getItem("chartdata")),
  value:  JSON.parse(localStorage.getItem("value"))||"" ,
  default: JSON.parse(localStorage.getItem("default")) || "today",
  newchart:undefined
};

export { state };
