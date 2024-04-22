import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/viva-bicho",
    headers: {
        "Content-type": "application/json",
        "Authorization": "Basic bHVjaWFubzpsdTEyMw=="
    },
})

export class AnimalService {
    getAnimals() {
        return axiosInstance.
        get("/animal");
    }
}