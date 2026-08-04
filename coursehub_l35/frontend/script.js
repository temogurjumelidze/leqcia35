const API = "http://127.0.0.1:8000";

const form = document.getElementById("courseForm");
const coursesDiv = document.getElementById("courses");


document
.getElementById("loadBtn")
.addEventListener("click", loadCourses);


form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const course = {

        title: document.getElementById("title").value,

        fee: document.getElementById("fee").value,

        confirm_fee: document.getElementById("confirmFee").value,

        is_available: document.getElementById("available").checked,

        instructor: document.getElementById("instructor").value

    };

    const response = await fetch(API + "/create/", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(course)

    });

    const data = await response.json();

    if (response.ok) {

        alert("Course created!");

        form.reset();

        loadCourses();

    } else {

        alert(JSON.stringify(data));

    }

});


async function loadCourses() {

    const response = await fetch(API + "/list/");

    const courses = await response.json();

    coursesDiv.innerHTML = "";

    courses.forEach(course => {

        const div = document.createElement("div");

        div.className = "course";

        let reviewsHTML = "";

        if (course.reviews && course.reviews.length) {

            reviewsHTML = "<ul>";

            course.reviews.forEach(review => {

                reviewsHTML += `
                <li>${review.message}</li>
                `;

            });

            reviewsHTML += "</ul>";

        }

        div.innerHTML = `

            <h3>${course.title}</h3>

            <p>Fee: $${course.fee}</p>

            <p>Available:
            ${course.is_available ? "✅" : "❌"}
            </p>

            <p>Instructor ID:
            ${course.instructor}
            </p>

            <strong>Reviews</strong>

            ${reviewsHTML}

            <div class="actions">

                <button
                class="update"
                onclick="updateCourse(${course.id})">
                Update
                </button>

                <button
                class="delete"
                onclick="deleteCourse(${course.id})">
                Delete
                </button>

            </div>

        `;

        coursesDiv.appendChild(div);

    });

}


async function deleteCourse(id) {

    if (!confirm("Delete this course?")) return;

    const response = await fetch(API + "/course/" + id + "/", {

        method: "DELETE"

    });

    if (response.ok) {

        loadCourses();

    }

}


async function updateCourse(id) {

    const newFee = prompt("Enter new fee");

    if (newFee == null) return;

    const response = await fetch(API + "/course/" + id + "/", {

        method: "PATCH",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            fee: newFee

        })

    });

    if (response.ok) {

        loadCourses();

    } else {

        alert("Update failed");

    }

}
