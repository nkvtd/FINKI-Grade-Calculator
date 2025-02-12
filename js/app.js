"use strict";

let subjects = [];

async function fetchData(){
    let result = await fetch("./data.json");
    subjects = await result;
    console.log(subjects);
}
fetchData();

