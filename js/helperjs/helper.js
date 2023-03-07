let formatstr = (str) => {
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

let gettime = (time) => {
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

export { gettime, formatstr, formatdate };
