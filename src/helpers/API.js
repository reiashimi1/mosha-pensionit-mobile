import Axios from "axios";

const API_URL = process.env.MOSHA_E_PENSIONIT_API;

// export const API = Axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//     "Access-Control-Allow-Origin": "*",
//     Accept: "application/json",
//   },
// });

export const API = {
  send: (method, url, params) => {
    let fullUrl = API_URL + url;
    const queryString = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");
    fullUrl += `?${queryString}`;
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Accept: "application/json",
      },
      params,
    };
    return fetch(fullUrl, options);
  },
};
