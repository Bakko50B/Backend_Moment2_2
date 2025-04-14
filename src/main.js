window.onload = function () {
  getData();
};

let myContentDivEL = document.getElementById("content");

async function getData() {
  const response = await fetch('http://localhost:3000/api/workexp');
  const data = await response.json();
  console.log(data)

  myContentDivEL.innerHTML = "";

  data.forEach(dataelement => {
    let endDate = dataelement.enddate ? dataelement.enddate.split('T')[0] : "Pågående";
    if (endDate === "0000-00-00") {
      endDate = "Pågående";
    }
    let description = dataelement.description;
    if (description === "" || description === null) {
      description = "Beskrivning av arbestuppgifterna saknas"
    }


  myContentDivEL.innerHTML += `
        <ul>
          <li><span class="bold">Företagsnamn:</span> ${dataelement.companyname}</li>
          <li><span class="bold">Jobtitel:</span> ${dataelement.jobtitle}</li>
          <li><span class="bold">Arbetsort:</span> ${dataelement.location}</li>
          <li><span class="bold">Startdatum:</span> ${dataelement.startdate.split('T')[0]}</li>
          <li><span class="bold">Startdatum:</span> ${endDate}</li> 
          <li><span class="bold">Arbetsbeskrivning:</span> ${description}</li>
          <li><span class="bold">Postcreated:</span> ${dataelement.postcreated.split('T')[0]}</li> 
        </ul>


      `

});

}

