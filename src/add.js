startdate.max = new Date("2050-01-01").toISOString().split("T")[0]; // Senaste framtida start är 2050-01-01
enddate.max = new Date().toISOString().split("T")[0];  // Kan inte sätta slutdatum i framtiden

let myErrorsEl = document.getElementById("errors");

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Förhindrar standardformulärens POST-funktion

        // Hämta formulärdata
        const formData = new FormData(form);
        const jsonData = Object.fromEntries(formData.entries()); // Gör om till JSON

        let isValid = true; 
        let errors = [];

        // Exempel på validering
        if (!formData.get("companyname") || formData.get("companyname").trim().length < 3) {
            console.error("Företagsnamnet måste innehålla minst 3 tecken.");
            isValid = false;
            errors.push("Företagsnamnet måste innehålla minst 3 tecken.")
        }
        if (!formData.get("jobtitle")) {
            console.error("Jobbtitel är obligatoriskt.");
            isValid = false;
            errors.push("Jobbtitel är obligatoriskt.");
        }
        if (!formData.get("location")) {
            console.error("Platsen mpste fyllas i");
            isValid = false;
            errors.push("Fyll i platsen!")
        }
        if (!formData.get("startdate")) {
            console.error("Startdatum är obligatoriskt");
            isValid = false;
            errors.push("Ange startdatum!");
        } 
        if (formData.get("enddate") && new Date(formData.get("enddate")) < new Date(formData.get("startdate"))) {
            console.error("Slutdatum kan inte vara tidigare än startdatum.");
            isValid = false;
            errors.push("Slutdatum kan inte vara tidigare än startdatum.");
        }          
        if (!isValid) {
            myErrorsEl.innerHTML = "";
            myErrorsEl.innerHTML = "<ul>"
            errors.forEach(error => {
                myErrorsEl.innerHTML += `
                <li class="red">${error}</li>
                `
            });
            myErrorsEl.innerHTML += '</ul>';
        }
        try {
            const response = await fetch('http://localhost:3000/api/workexp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonData),
            });

            if (response.ok) {
                alert('Posten har lagts till!');
                form.reset(); // Rensa formuläret efter inskick
                window.location.replace('index.html'); // Till indexsidan

            } else {
                alert('Det gick inte att lägga till posten. Försök igen.');
            }
        } catch (error) {
            console.error('Ett fel uppstod:', error);
            alert('Ett fel uppstod vid kommunikation med servern.');
        }
    });
});

