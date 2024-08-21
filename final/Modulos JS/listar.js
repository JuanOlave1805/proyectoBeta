import { URL } from "./config.js";
const solicitud = async (endpoint) => {
    try {
      let solicitud = await fetch(`${URL}${endpoint}`);
      let data = await solicitud.json();
      return data;
    } catch (error) {
      return error;
    }
  };

  export default solicitud;