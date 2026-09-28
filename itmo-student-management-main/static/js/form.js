const studentForm = document.getElementById("studentForm");

const fullNameInput = document.getElementById("fullName");
const groupInput = document.getElementById("group");
const isuIdInput = document.getElementById("isuId");
const dormitoryNumberInput = document.getElementById("dormitoryNumber");
const roomNumberInput = document.getElementById("roomNumber");
const moveInDateInput = document.getElementById("moveInDate");
const isForeignInput = document.getElementById("isForeign");
const notesInput = document.getElementById("notes");


const today = new Date();

const todayString = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" +
    String(today.getDate()).padStart(2, "0");

moveInDateInput.max = todayString;


function validateFullName() {
    const fullName = fullNameInput.value.trim();
    const nameParts = fullName.split(/\s+/);

    if (nameParts.length < 2 || nameParts.some(part => part.length < 2)) {
        fullNameInput.setCustomValidity("ФИО должно содержать минимум 2 отдельных слова и длина" +
            " каждого должна составлять не менее 2 символов");
    } else {
        fullNameInput.setCustomValidity("");
    }
}

async function isIsuIdUnique(isuId, currentStudentId) {
    const students = await getAllStudents();

    return !students.some(function (student) {
        return Number(student.isuId) === isuId
            && student.id !== currentStudentId;
    });
}

fullNameInput.addEventListener("input", validateFullName);

isuIdInput.addEventListener("input", function () {isuIdInput.setCustomValidity("")});


studentForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    validateFullName();

    if (!studentForm.checkValidity()) {
        studentForm.reportValidity();
        return;
    }

    const isuId = isuIdInput.valueAsNumber;

    const uniqueIsuId = await isIsuIdUnique(isuId, studentId);

    if (!uniqueIsuId) {
        isuIdInput.setCustomValidity("Студент с таким ИСУ ID уже существует");
        isuIdInput.reportValidity();
        return;
    }

    isuIdInput.setCustomValidity("");


    const student = {
        fullName: fullNameInput.value.trim(),
        group: groupInput.value.trim(),
        isuId: isuIdInput.valueAsNumber,
        dormitoryNumber: dormitoryNumberInput.valueAsNumber,
        roomNumber: roomNumberInput.valueAsNumber,
        moveInDate: moveInDateInput.value,
        isForeign: isForeignInput.checked,
        notes: notesInput.value.trim()
    };

    try {
        if (studentId) {
            student.id = studentId;

            await updateStudent(student);
        } else {
            await addStudent(student);
        }

        window.location.href = "index.html";

    } catch (error) {
        console.error("Ошибка сохранения студента:", error);
    }
});


const params = new URLSearchParams(window.location.search);

const studentId = Number(params.get("id"));

async function loadStudentForEditing() {
    if (!studentId) {
        return;
    }

    try {
        const student = await getStudent(studentId);

        if (!student) {
            return;
        }

        fullNameInput.value = student.fullName;
        groupInput.value = student.group;
        isuIdInput.value = student.isuId;
        dormitoryNumberInput.value = student.dormitoryNumber;
        roomNumberInput.value = student.roomNumber;
        moveInDateInput.value = student.moveInDate;
        isForeignInput.checked = student.isForeign;
        notesInput.value = student.notes;

    } catch (error) {
        console.error("Ошибка загрузки студента:", error);
    }
}

loadStudentForEditing();