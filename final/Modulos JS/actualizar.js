import { URL } from "./config.js";

const actualizarDato = async (endpoint, bodyData) => {
    try {
        const respuesta = await fetch(`${URL}${endpoint}/${bodyData.id}`, {
            method: 'PUT',
            body: JSON.stringify(bodyData),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        
        // Parsear la respuesta a JSON
        const data = await respuesta.json();

        // Manejar la respuesta en función de si la solicitud fue exitosa
        if (respuesta.ok) {
            return data;
        } else {
            console.error("Error en la actualización:", data);
            return null;
        }
    } catch (error) {
        console.error("Error al agregar dato:", error);
        return null;
    }
};

export default actualizarDato;