from flask import Flask, render_template
from routes.student_routes import student_routes     # ← эта строка обязательна

app = Flask(__name__)

app.json.ensure_ascii = False

app.register_blueprint(student_routes)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/student-form.html")
def student_form():
    return render_template("student-form.html")


@app.route("/student-details.html")
def student_details():
    return render_template("student-details.html")


if __name__ == "__main__":
    app.run(debug=True)