from flask import Blueprint, jsonify, request

from repositories.student_repository import (
    get_all_students,
    get_student_by_id
)
from services.student_service import (
    create_student,
    update_student,
    delete_student,
    validate_student_data
)

student_routes = Blueprint("student_routes", __name__)


@student_routes.get("/api/requests")
def get_requests():
    students = get_all_students()

    return jsonify(students), 200


@student_routes.get("/api/requests/<int:student_id>")
def get_request(student_id):
    student = get_student_by_id(student_id)

    if student is None:
        return jsonify({
            "error": {
                "code": 404,
                "message": "Студент не найден"
            }
        }), 404

    return jsonify(student), 200


@student_routes.post("/api/requests")
def create_request():
    if not request.is_json:
        return jsonify({
            "error": {
                "code": 400,
                "message": "Тело запроса должно содержать JSON"
            }
        }), 400

    data = request.get_json(silent=True)

    if data is None:
        return jsonify({
            "error": {
                "code": 400,
                "message": "Некорректный JSON"
            }
        }), 400

    errors = validate_student_data(data)

    if errors:
        return jsonify({
            "error": {
                "code": 422,
                "message": "Ошибка валидации",
                "details": errors
            }
        }), 422

    try:
        student = create_student(data)

        return jsonify(student), 201

    except ValueError as error:
        return jsonify({
            "error": {
                "code": 409,
                "message": str(error)
            }
        }), 409


@student_routes.patch("/api/requests/<int:student_id>")
def update_request(student_id):
    student = get_student_by_id(student_id)

    if student is None:
        return jsonify({
            "error": {
                "code": 404,
                "message": "Студент не найден"
            }
        }), 404

    if not request.is_json:
        return jsonify({
            "error": {
                "code": 400,
                "message": "Тело запроса должно содержать JSON"
            }
        }), 400

    data = request.get_json(silent=True)

    if data is None:
        return jsonify({
            "error": {
                "code": 400,
                "message": "Некорректный JSON"
            }
        }), 400

    student.update(data)

    errors = validate_student_data(student)

    if errors:
        return jsonify({
            "error": {
                "code": 422,
                "message": "Ошибка валидации",
                "details": errors
            }
        }), 422

    try:
        updated_student = update_student(student_id, data)

        return jsonify(updated_student), 200

    except ValueError as error:
        return jsonify({
            "error": {
                "code": 409,
                "message": str(error)
            }
        }), 409


@student_routes.delete("/api/requests/<int:student_id>")
def delete_request(student_id):
    deleted = delete_student(student_id)

    if not deleted:
        return jsonify({
            "error": {
                "code": 404,
                "message": "Студент не найден"
            }
        }), 404

    return "", 204
