import { getmethod } from "./helperjs/apireq.js";
import { state } from "./state.js";
import { filterbydate, formatdate } from "./helperjs/helper.js";

async function getdetails(query) {
  let landata;
  let data ;
  if (!query) {
    return;
  }

  landata = await getmethod(
    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=6154f8e10b3e8382c5f1896812f2903b`
  );

  let { lat, lon } = landata[0];
 data = await getmethod(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=6154f8e10b3e8382c5f1896812f2903b`
  );
  return data;
}

async function getbycity(query) {
  let landata;
  let weatherdata;
  if (query) {
  landata = await getmethod(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=6154f8e10b3e8382c5f1896812f2903b`
    );
    let { lat, lon } = landata[0];

    weatherdata = await getmethod(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=6154f8e10b3e8382c5f1896812f2903b`
    );
    return weatherdata.list;
  }
}

let gethourlydata = async (filterby) => {
  let data = await getbycity(state.value);
  let date = new Date();
  let filtering;

  let year = date.getFullYear();

  let month = date.getMonth() + 1 + "";

  let day = date.getDate() + "";
  let hours = date.getHours();

  if (filterby === "today") {
    filtering = formatdate(year, month, day);
  } else if (filterby === "tomorrow") {
    day = +day + 1 + "";
    filtering = formatdate(year, month, day);
  }
  getchartdata(filtering, data);
return filterbydate(data,filterby,filtering,hours)
 
};

let getchartdata = (filtering, data) => {
  let chartdata = data.filter((el) => {
    return el.dt_txt.includes(filtering);
  });
  state.chartdata = chartdata;
  localStorage.setItem("chartdata", JSON.stringify(chartdata));
};
export { getbycity, getdetails, gethourlydata };
