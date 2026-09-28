const API_URL = "/api/requests"; 

async function getStudents(filters = {}) {
    const params = new URLSearchParams();

    if (filters.group) {
        params.set("group", filters.group);
    }
    if (filters.dormitoryNumber) {
        params.set("dormitoryNumber", filters.dormitoryNumber);
    }
    if (filters.isForeign !== undefined && filters.isForeign !== "") {
        params.set("isForeign", filters.isForeign);
    }

    const query = params.toString();
    const url = query ? API_URL + "?" + query : API_URL;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Ошибка загрузки студентов: " + response.status);
    }

    return response.json();
}
