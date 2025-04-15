window.onload = function () {
  getData();
};

let myContentDivEL = document.getElementById("content");

async function getData() {
  const response = await fetch('http://localhost:3000/api/workexp');
  const data = await response.json();
  console.log(data);

  myContentDivEL.innerHTML = ""; // Rensa innehåll innan nya data läggs till

  data.forEach(dataelement => {
    let endDate = dataelement.enddate ? dataelement.enddate.split('T')[0] : "Pågående";
    if (endDate === "0000-00-00") {
      endDate = "Pågående";
    }
    let description = dataelement.description;
    if (!description) {
      description = "Beskrivning av arbestuppgifterna saknas";
    }

    myContentDivEL.innerHTML += `
      <ul>
        <li><span class="bold">Företagsnamn:</span> ${dataelement.companyname}</li>
        <li><span class="bold">Jobtitel:</span> ${dataelement.jobtitle}</li>
        <li><span class="bold">Arbetsort:</span> ${dataelement.location}</li>
        <li><span class="bold">Startdatum:</span> ${dataelement.startdate.split('T')[0]}</li>
        <li><span class="bold">Slutdatum:</span> ${endDate}</li> 
        <li><span class="bold">Arbetsbeskrivning:</span> ${description}</li>
        <li><span class="bold">Postcreated:</span> ${dataelement.postcreated.split('T')[0]}</li> 
        <li><button value="${dataelement.id}">Radera</button></li>
      </ul>
    `;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const parentElement = document.getElementById("content"); 

  parentElement.addEventListener('click', async (event) => {
    // Kontrollera om klicket sker på en knapp
    if (event.target.tagName === 'BUTTON') {
      // alert('Knapp klickad!');
      
      // Hämta ID från knappens värde
      const id = event.target.value;
      const confirmDelete = confirm('Är du säker på att du vill radera detta?');

      if (confirmDelete) {
        console.log(`Ta bort objekt med ID: ${id}`);

        try {
          // Skicka DELETE-förfrågan till API:et
          const response = await fetch(`http://localhost:3000/api/workexp/${id}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            alert(`Posten med ID ${id} har raderats!`);
            // Ta bort elementet från DOM
            const listItem = event.target.closest('ul'); // Hitta och ta bort hela posten
            if (listItem) {
              listItem.remove();
            }
          } else {
            alert('Det gick inte att radera posten. Försök igen senare.');
          }
        } catch (error) {
          console.error('Ett fel inträffade vid borttagning:', error);
          alert('Ett fel uppstod vid radering av posten.');
        }
      }
    }
  });
});
