export const getmethod = async (url) => {
  try {
    let res = await fetch(url);
    let data = await res.json();
    if (!res.ok) {
      throw Error("Something went wrong,try after sometime");
    }
    return data;
  } catch (err) {
    console.log(err);
  }
};
