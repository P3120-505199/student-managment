const studentsTableBody = document.getElementById("studentsTableBody");


function formatDate(dateString) {
    const parts = dateString.split("-");

    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    return day + "." + month + "." + year;
}

const filterGroupInput = document.getElementById("filterGroup");
const filterDormitoryInput = document.getElementById("filterDormitory");
const filterIsForeignSelect = document.getElementById("filterIsForeign");
const applyFiltersButton = document.getElementById("applyFilters");
const resetFiltersButton = document.getElementById("resetFilters");


function formatDate(dateString) { /* ... без изменений ... */ }


function readFilters() {
    const filters = {};

    const group = filterGroupInput.value.trim();
    if (group) {
        filters.group = group;
    }

    const dormitoryNumber = filterDormitoryInput.value.trim();
    if (dormitoryNumber) {
        filters.dormitoryNumber = dormitoryNumber;
    }

    const isForeign = filterIsForeignSelect.value;
    if (isForeign !== "") {
        filters.isForeign = isForeign;
    }

    return filters;
}


function buildQueryString(filters) {
    const params = new URLSearchParams();

    if (filters.group) {
        params.set("group", filters.group);
    }
    if (filters.dormitoryNumber) {
        params.set("dormitoryNumber", filters.dormitoryNumber);
    }
    if (filters.isForeign !== undefined) {
        params.set("isForeign", filters.isForeign);
    }

    return params.toString();
}


async function loadStudents(filters = {}) {
    try {
        const students = await getStudents(filters);

        renderStudents(students);
    } catch (error) {
        console.error("Ошибка загрузки студентов:", error);
    }
}


function renderStudents(students) {
    studentsTableBody.textContent = "";

    students.forEach(function (student) {
        // ... тот же код построения строки, что и раньше ...
    });
}


function onApplyFilters() {
    const filters = readFilters();
    const query = buildQueryString(filters);

    // Обновляем URL, чтобы запрос был виден и его можно было переслать
    const newUrl = query
        ? window.location.pathname + "?" + query
        : window.location.pathname;

    history.replaceState(null, "", newUrl);

    loadStudents(filters);
}


function onResetFilters() {
    filterGroupInput.value = "";
    filterDormitoryInput.value = "";
    filterIsForeignSelect.value = "";

    history.replaceState(null, "", window.location.pathname);

    loadStudents();
}


function initFilters() {
    applyFiltersButton.addEventListener("click", onApplyFilters);
    resetFiltersButton.addEventListener("click", onResetFilters);

    // При загрузке страницы читаем фильтры из URL (если есть)
    const params = new URLSearchParams(window.location.search);

    filterGroupInput.value = params.get("group") || "";
    filterDormitoryInput.value = params.get("dormitoryNumber") || "";
    filterIsForeignSelect.value = params.get("isForeign") || "";
}