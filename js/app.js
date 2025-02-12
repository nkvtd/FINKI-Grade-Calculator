"use strict";

let subjects = [];
let ispit = true;

function updateToggle(){
    if(ispit){
        ispit=false;
    } else if(!ispit){
        ispit=true;
    }
}
async function fetchData() {
    let result = await fetch("./data.json");
    subjects = await result.json();
    console.log(subjects);
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
        document.getElementById("subject-selector").appendChild(s)
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
    container.innerHTML=""

    const fields = [
        { key: "firstMidterm", label: "Поени од прв колоквиум" },
        { key: "secondMidTerm", label: "Поени од втор колоквиум" },
        { key: "firstMidtermTheoretical", label: "Поени од прв колоквиум теорија" },
        { key: "firstMidtermPractical", label: "Поени од прв колоквиум практично" },
        { key: "secondMidTermTheoretical", label: "Поени од втор колоквиум теорија" },
        { key: "secondMidTermPractical", label: "Поени од втор колоквиум практично" },
        { key: "labs", label: "Поени од лабораториски вежби" },
        { key: "quiz", label: "Поени од тестови" },
        { key: "attendance", label: "Поени за присуство" },
        { key: "project", label: "Поени од проект" },
        { key: "auds", label: "Поени од аудиториски вежби" },
        { key: "geogebra", label: "Поени од геогебра" }
    ];


    fields.forEach(({ key, label }) => {
        if (subject.hasOwnProperty(key)) {
            let div = document.createElement("div");
            div.className = "input-field";

            let labelElement = document.createElement("label");
            labelElement.htmlFor = key;
            labelElement.textContent = label;

            let input = document.createElement("input");
            input.id = key;
            input.name = key;
            input.required = true;

            div.appendChild(labelElement);
            div.appendChild(input);
            container.appendChild(div);
        }
    });


    let button = document.createElement("button")
    button.id = `calculate-button`
    button.innerHTML=`Пресметај поени`
    button.onclick=()=>getPoints(subject)
    document.getElementById("calculate-button-container").appendChild(button)
}

function getPoints(subject) {
    let existingP = document.getElementById("points")
    if(existingP){
        existingP.remove()
    }
    let points = 0.00

    const fields = [
        "firstMidterm",
        "secondMidTerm",
        "firstMidtermTheoretical",
        "secondMidTermTheoretical",
        "firstMidtermPractical",
        "secondMidTermPractical",
        "labs",
        "quiz",
        "attendance",
        "project",
        "auds",
        "geogebra"
    ];

    fields.forEach((field) => {
        let input = document.getElementById(field)

        if (input && input.value) {
            points += parseFloat(input.value)*subject[field]
        }
    });

    let grade = Object.keys(subject.gradingScale).find(g => {
        let [low, high] = subject.gradingScale[g].split('-').map(Number);
        return points >= low && points <= high;
    })

    let p = document.createElement("p")

    p.id=`points`
    p.innerHTML = `<p>Имате ${points.toFixed(2)} поени по предметот <span>${subject.name}</span>, што е оцена <span>${grade}</span></p>`
    document.getElementById("calculation").appendChild(p)
}
