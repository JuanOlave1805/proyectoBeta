import { URL } from "./config.js";

const agregarDato = async (endpoint, bodyData) => {
    try {
        const respuesta = await fetch(`${URL}${endpoint}`, {
            method: 'POST',
            body: JSON.stringify(bodyData),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        
        const data = await respuesta.json();
        return data;
    } catch (error) {
        console.error("Error al agregar dato:", error);
        return error;
    }
};

export default agregarDato;