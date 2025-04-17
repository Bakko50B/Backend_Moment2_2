window.onload = function () {
  getData();
};

const myContentDivEL = document.getElementById("content");

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
        <li><span class="bold">Jobbtitel:</span> ${dataelement.jobtitle}</li>
        <li><span class="bold">Arbetsort:</span> ${dataelement.location}</li>
        <li><span class="bold">Startdatum:</span> ${dataelement.startdate.split('T')[0]}</li>
        <li><span class="bold">Slutdatum:</span> ${endDate}</li> 
        <li><span class="bold">Arbetsbeskrivning:</span> ${description}</li>
        <li><span class="bold">Postcreated:</span> ${dataelement.postcreated.split('T')[0]}</li> 
        <li>
          <button class="update" value="${dataelement.id}">Uppdatera</button> <!-- id="update" -->
          <button class="delete" value="${dataelement.id}">Radera</button> <!-- id="delete" -->
        </li>
      </ul>
    `;
  });
}
const populateForm = (postData) => {
  const form = document.getElementById('updateForm'); 
  form.style.display = 'block'; 
  form.querySelector('[name="companyname"]').value = postData.companyname;
  form.querySelector('[name="jobtitle"]').value = postData.jobtitle;
  form.querySelector('[name="location"]').value = postData.location;
  form.querySelector('[name="startdate"]').value = postData.startdate.split('T')[0];
  form.querySelector('[name="enddate"]').value = postData.enddate ? postData.enddate.split('T')[0] : '';
  form.querySelector('[name="description"]').value = postData.description || '';
  form.querySelector('[name="id"]').value = postData.id; 
  form.scrollIntoView({ behavior: 'smooth', block: 'center' });               
};

// Händelse hantering av knapparna UPPDATERA och DELETE
myContentDivEL.addEventListener('click', async (event) => {
  // DELETEKNAPPEN
  // Hantera radering
  if (event.target.tagName === 'BUTTON' && event.target.classList.contains('delete')) {
      const id = event.target.value;
      console.log(`Radera objekt med ID: ${id}`);

      const confirmDelete = confirm('Är du säker på att du vill radera detta?');
      if (confirmDelete) {
          try {
              const response = await fetch(`http://localhost:3000/api/workexp/${id}`, {
                  method: 'DELETE',
              });
              if (response.ok) {
                  alert(`Posten med ID ${id} har raderats!`);
                  const listItem = event.target.closest('ul');
                  if (listItem) {
                      listItem.remove();
                  }
              } else {
                  alert('Det gick inte att radera posten. Försök igen senare.');
              }
          } catch (error) {
              console.error('Ett fel inträffade vid radering:', error);
              alert('Ett fel uppstod vid radering av posten.');
          }
      }
  }

  // UPDATEKNAPPEN
  // Hantera uppdateringsinformation och visa formuläret för uppdatering.
  if (event.target.tagName === 'BUTTON' && event.target.classList.contains('update')) {
      const id = event.target.value;
      console.log(`Uppdatera objekt med ID: ${id}`);
      try {
          const response = await fetch(`http://localhost:3000/api/workexp/${id}`);
          if (response.ok) {
              const postData = await response.json();
              populateForm(postData); // Skicka data till formuläret
          } else {
              alert('Det gick inte att hämta data för uppdatering.');
          }
      } catch (error) {
          console.error('Ett fel inträffade vid hämtning av data:', error);
          alert('Ett fel uppstod vid hämtning av data.');
      }
  }
});

// Uppdatera apiet/databasen med den ändrade CV-posten
// SUBMIT från Uppdateringsformuläret
document.addEventListener('DOMContentLoaded', () => {
  const updateForm = document.getElementById('updateForm');

  updateForm.addEventListener('submit', async (event) => {
      event.preventDefault();       

      const formData = new FormData(updateForm);
      const jsonData = Object.fromEntries(formData.entries()); 
      const id = jsonData.id;       //Hämta ID för uppdateringen

      try {
          const response = await fetch(`http://localhost:3000/api/workexp/${id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(jsonData),
          });

          if (response.ok) {
              alert('Posten har uppdaterats!');
              updateForm.style.display = 'none';  // Dölj formuläret
              getData();                          // Uppdatera sidan
              window.history.replaceState(null, '', window.location.pathname); // Ta bort parametrarna
          } else {
              alert('Det gick inte att uppdatera posten.');
          }
      } catch (error) {
          console.error('Ett fel inträffade vid uppdatering:', error);
          alert('Ett fel uppstod vid uppdateringen.');
      }
  });
});

const myCancelBtn = document.getElementById("cancel");

myCancelBtn.addEventListener("click", () => {
  const updateForm = document.getElementById('updateForm');
  updateForm.style.setProperty("display", "none"); 
});