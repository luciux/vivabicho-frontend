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

    insertAnimal(animal: Projeto.Animal) {
        return axiosInstance.
            post("/animal", animal);
    }

    updateAnimal(animal: Projeto.Animal) {
        return axiosInstance.
            put("/animal", animal);
    }

    deleteAnimal(id?: number) {
        return axiosInstance.
            delete(`/animal/${id}`);
    }

    getAnimalById(id: number) {
        return axiosInstance.
            get(`/animal/${id}`);
    }
}