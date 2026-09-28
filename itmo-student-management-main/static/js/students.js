const studentsTableBody = document.getElementById("studentsTableBody");

const filterGroupInput = document.getElementById("filterGroup");
const filterDormitoryInput = document.getElementById("filterDormitory");
const filterIsForeignSelect = document.getElementById("filterIsForeign");
const applyFiltersButton = document.getElementById("applyFilters");
const resetFiltersButton = document.getElementById("resetFilters");


function formatDate(dateString) {
    const parts = dateString.split("-");

    return parts[2] + "." + parts[1] + "." + parts[0];
}


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


function createCell(text) {
    const cell = document.createElement("td");
    cell.textContent = text;
    return cell;
}


function createActionButton(label, onClick) {
    const button = document.createElement("button");
    button.textContent = label;
    button.addEventListener("click", onClick);
    return button;
}


function renderStudents(students) {
    studentsTableBody.textContent = "";

    students.forEach(function (student) {
        const row = document.createElement("tr");

        row.appendChild(createCell(student.fullName));
        row.appendChild(createCell(student.group));
        row.appendChild(createCell(student.isuId));
        row.appendChild(createCell(student.dormitoryNumber));
        row.appendChild(createCell(student.roomNumber));
        row.appendChild(createCell(formatDate(student.moveInDate)));

        const actionsCell = document.createElement("td");
        const actions = document.createElement("div");
        actions.classList.add("actions");

        actions.appendChild(createActionButton("Подробнее", function () {
            window.location.href = "student-details.html?id=" + student.id;
        }));

        actions.appendChild(createActionButton("Редактировать", function () {
            window.location.href = "student-form.html?id=" + student.id;
        }));

        actions.appendChild(createActionButton("Удалить", async function () {
            const shouldDelete = confirm("Удалить студента " + student.fullName + "?");

            if (!shouldDelete) {
                return;
            }

            try {
                await deleteStudent(student.id);
                await loadStudents(readFilters());
            } catch (error) {
                console.error("Ошибка удаления студента:", error);
            }
        }));

        actionsCell.appendChild(actions);
        row.appendChild(actionsCell);

        studentsTableBody.appendChild(row);
    });
}


async function loadStudents(filters = {}) {
    try {
        const students = await getStudents(filters);
        renderStudents(students);
    } catch (error) {
        console.error("Ошибка загрузки студентов:", error);
    }
}


function onApplyFilters() {
    const filters = readFilters();
    const query = buildQueryString(filters);

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

    const params = new URLSearchParams(window.location.search);

    filterGroupInput.value = params.get("group") || "";
    filterDormitoryInput.value = params.get("dormitoryNumber") || "";
    filterIsForeignSelect.value = params.get("isForeign") || "";
}


initFilters();
loadStudents(readFilters());
