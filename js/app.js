"use strict";

let subjects = [];
let exam = true;

function updateToggle(){
    exam = !exam

    let subjectName = document.getElementById("subject-name").innerHTML
    if(subjectName){
        getInput(subjectName)
    }

}
async function fetchData() {
    let result = await fetch("./data.json")
    subjects = await result.json()
    populateSubjects();
}

fetchData();

function populateSubjects() {
    subjects.forEach(subject => {
        let s = document.createElement("div")
        s.className="subject"
        s.title=subject.name
        s.innerHTML=subject.acronym
        s.onclick=()=>getInput(subject.name)
        document.getElementById("subjects-container").appendChild(s)
    })
}

function getInput(subjectName) {
    let existingButton = document.getElementById("calculate-button")
    if(existingButton){
        existingButton.remove()
    }
    let existingScore = document.getElementById("score")
    if(existingScore){
        existingScore.innerHTML=""
    }

    let subject = subjects.find((s) => s.name === subjectName)

    document.getElementById("subject-name").innerHTML = subject.name

    let container = document.getElementById("input-set");
    container.innerHTML=``

    if (exam) {
        const examFields = [
            { key: "exam", label: "Поени од испит" },
            { key: "examPractical", label: "Поени од испит практично" },
            { key: "examTheoretical", label: "Поени од испит теорија" },
        ];

        examFields.forEach(field => {
            if (subject.exam.hasOwnProperty(field.key)) {
                let div = document.createElement("div");
                div.className = "input-field";

                let labelElement = document.createElement("label");
                labelElement.htmlFor = field.key;
                labelElement.textContent = field.label;

                let inputElement = document.createElement("input");
                inputElement.id = field.key;
                inputElement.name = field.key;
                inputElement.required = true;

                div.appendChild(labelElement);
                div.appendChild(inputElement);
                container.appendChild(div);
            }
        });
    } else {
        const midtermFields = [
            { key: "firstMidterm", label: "Поени од прв колоквиум" },
            { key: "secondMidTerm", label: "Поени од втор колоквиум" },
            { key: "firstMidtermTheoretical", label: "Поени од прв колоквиум теорија" },
            { key: "firstMidtermPractical", label: "Поени од прв колоквиум практично" },
            { key: "secondMidTermTheoretical", label: "Поени од втор колоквиум теорија" },
            { key: "secondMidTermPractical", label: "Поени од втор колоквиум практично" }
        ];

        midtermFields.forEach(field => {
            if (subject.midterm.hasOwnProperty(field.key)) {
                let div = document.createElement("div");
                div.className = "input-field";

                let labelElement = document.createElement("label");
                labelElement.htmlFor = field.key;
                labelElement.textContent = field.label;

                let inputElement = document.createElement("input");
                inputElement.id = field.key;
                inputElement.name = field.key;

                div.appendChild(labelElement);
                div.appendChild(inputElement);
                container.appendChild(div);
            }
        });
    }


    const fields = [
        { key: "quiz", label: "Поени од тестови" },
        { key: "project", label: "Поени од проект" },
        { key: "attendance", label: "Поени за присуство" },
        { key: "labs", label: "Поени од лабораториски вежби" },
        { key: "auds", label: "Поени од аудиториски вежби" },
        { key: "geogebra", label: "Поени од геогебра" }
    ];
    fields.forEach(field => {
        if (subject.hasOwnProperty(field.key)) {
            let div = document.createElement("div");
            div.className = "input-field";

            let labelElement = document.createElement("label");
            labelElement.htmlFor = field.key;
            labelElement.textContent = field.label;

            let inputElement = document.createElement("input");
            inputElement.id = field.key;
            inputElement.name = field.key;
            inputElement.required = true;

            div.appendChild(labelElement);
            div.appendChild(inputElement);
            container.appendChild(div);
        }
    });


    let button = document.createElement("button")
    button.id = "calculate-button"
    button.innerHTML="Пресметај поени"
    button.onclick=()=>getPoints(subject)
    document.getElementById("calculate-button-container").appendChild(button)
}

function getPoints(subject){
    let existingP = document.getElementById("points")
    if(existingP){
        existingP.remove()
    }
    let points = 0.00
    let valid = true

    if(exam){
        const examFields = [
            "exam",
            "examPractical",
            "examTheoretical",
        ];

        examFields.forEach((field) => {
            let input = document.getElementById(field)

            if (input && input.value) {
                if((input.value < 0 || input.value > 100)){
                    valid = false
                }
                points += parseFloat(input.value)*subject.exam[field]
            }
        });

    } else {
        const midtermFields = [
            "firstMidterm",
            "secondMidTerm",
            "firstMidtermTheoretical",
            "firstMidtermPractical",
            "secondMidTermTheoretical",
            "secondMidTermPractical",
        ];

        midtermFields.forEach((field) => {
            let input = document.getElementById(field)

            if (input && input.value) {
                if((input.value < 0 || input.value > 100)){
                    valid = false
                }
                points += parseFloat(input.value)*subject.midterm[field]
            }
        });
    }

    const fields = [
        "quiz",
        "project",
        "attendance",
        "labs",
        "auds",
        "geogebra",
    ];

    fields.forEach((field) => {
        let input = document.getElementById(field)

        if (input && input.value) {
            if(input.value < 0 || input.value > 100){
                valid = false
            }
            points += parseFloat(input.value)*subject[field]
        }
    });

    let grade = Object.keys(subject.gradingScale).find(g => {
        let [low, high] = subject.gradingScale[g].split('-').map(Number);
        return points >= low && points <= high;
    })

    if(valid && !isNaN(valid) && points > 0){
        let p = document.createElement("p")

        p.id=`points`
        p.innerHTML = `<p>Имате <span>${points.toFixed(2)}</span> поени, што е оцена <span>${grade}</span>.</p>`
        document.getElementById("score").appendChild(p)
    } else {

        const container = document.getElementById("result-field");
        container.classList.add("shake");
        setTimeout(() => {
            container.classList.remove("shake");
        }, 500);
    }
}
