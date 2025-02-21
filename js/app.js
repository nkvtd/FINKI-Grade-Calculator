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
                inputElement.required = true;

                div.appendChild(labelElement);
                div.appendChild(inputElement);
                container.appendChild(div);
            }
        });
    }


    const fields = [
        { key: "labs", label: "Поени од лабораториски вежби" },
        { key: "quiz", label: "Поени од тестови" },
        { key: "attendance", label: "Поени за присуство" },
        { key: "project", label: "Поени од проект" },
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
