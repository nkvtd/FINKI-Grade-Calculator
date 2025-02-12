"use strict";

let subjects = [];

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
        document.getElementById("subject-selector").appendChild(s)
    })
}
