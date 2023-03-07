const formatstr = (str) => {
  str = str + "";
  let resultstr;
  if (str.length === 1) {
    resultstr = "0" + str;
  } else {
    resultstr = str;
  }
  return resultstr;
};

let formatdate = (year, month, day) => {
  return year + "-" + formatstr(month) + "-" + formatstr(day);
};

const gettime = (time) => {
  let resulttime;
 
  if (time > 12) {
    resulttime = formatstr(time - 12) + " " + "PM";
  } else if (time === "12") {
    resulttime = time + " " + "PM";
  } else if (time === "00") {
    resulttime = 12 + " " + "AM";
  } else {
    resulttime = time + " " + "AM";
  }
  return resulttime;
};

const filterbydate=(data,filterby,filtering,hours)=>{
  let rendererdata = data.filter((el) => {
    let time = +el.dt_txt.split(" ")[1].split(":")[0];
    if (filterby === "today") {
      return el.dt_txt.includes(filtering) && time > hours;
    } else {
      return el.dt_txt.includes(filtering);
    }
  });
  return rendererdata
}

export { gettime, formatstr, formatdate,filterbydate };
