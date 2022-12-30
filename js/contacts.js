let contacts = [];
let letters = [];
let currentcolor = 0;

setURL("https://gruppe-397.developerakademie.net/smallest_backend_ever");

async function init() {
    await downloadFromServer();
    contacts = JSON.parse(backend.getItem("contacts")) || [];
    console.log(contacts);
    showContacts();
}

function showAddcontact() {
    document.getElementById("addcontact").classList.remove("d-none");
}

function closeAddcontact() {
    document.getElementById("addcontact").classList.add("d-none");
}

function notClose(event) {
    event.stopPropagation();
}

function clearInput() {
    document.getElementById("input_name").value = "";
    document.getElementById("input_email").value = "";
    document.getElementById("input_phone").value = "";
}

function randomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);

    return `rgb(${r} ,${g} , ${b})`;
}

async function createContact() {
    let name = document.getElementById("input_name");
    let email = document.getElementById("input_email");
    let phone = document.getElementById("input_phone");
    let color = randomColor();
    contacts.push({
        name: name.value,
        email: email.value,
        phone: phone.value,
        color: color,
    });
    await backend.setItem("contacts", JSON.stringify(contacts));
    window.location.href = "./contact.html";
}

function showContacts() {
    sortContacts(contacts); 
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        splittedName = contact.name.split(" ");
        pushFirstLetter(contact);
        document.getElementById("contactsContainer").innerHTML = "";
        for (let j = 0; j < letters.length; j++) {
            const letter = letters[j]; 
            document.getElementById("contactsContainer").innerHTML +=
            renderLetters(letter,j);
            document.getElementById('filtered_container').innerHTML+=
            showContactsHtml(contact, splittedName, i);
        }
    }
}

function pushFirstLetter(contact) {
    const firstLetter = contact.name.charAt(0);
    if (!letters.includes(firstLetter)) {
        letters.push(firstLetter);
    }
}

function renderLetters(letter,j) {
    return `
    <div id="filtered_container" class="container-filtered-contacts">
        <span class="letters">${letter}</span>
    </div>`;
}

function sortContacts(contacts) {
    contacts = contacts.sort((a, b) => {
        let a1 = a.name.toLowerCase();
        let b1 = b.name.toLowerCase();
        return a1 < b1 ? -1 : a1 > b1 ? 1 : 0;
    });
}

function showContactsHtml(contact, splittedName, i) {
    return `
    <div onclick="showContact(${i})" class="contact-card">
     <div style="background-color:${
         contact.color
     }" class="initials-contact">${splittedName[0].charAt(
        0
    )}${splittedName[1].charAt(0)}</div>
     <div class="contact-card-text"> 
         <p> ${contact.name} </p>
         <span> ${contact.email} </span>
     </div>
    </div>`;
}

function showContact(i) {
    document.getElementById("contactAreaBody").innerHTML = "";
    let contact = contacts[i];
    let splittedName = contact.name.split(" ");
    document.getElementById("contactAreaBody").innerHTML = showContactHtml(
        contact,
        splittedName,
        i
    );
}

function showContactHtml(contact, splittedName, i) {
    return `
<div class="contactarea-body-name">
    <div  style="background-color:${
        contact.color
    }" class="initials-contact-body">
        ${splittedName[0].charAt(0)}${splittedName[1].charAt(0)}
    </div>
    <div class="container-name">
        <h3>${contact.name} </h3>
        <div class="add-task-link">
            <img src="./assets/img/plus-lightblue.png" />
            <span>Add Task</span>
        </div>
    </div>
</div>    
<div class="contactarea-body-contactinfo">
    <span class="text-contact-info">Contact Information</span>
    <div onclick="openEditContact(${i})" class="edit-link">
        <img src="./assets/img/pen-blue.png" />
        <span>Edit Contact</span>
    </div>
</div>
<div class="contactarea-body-info">
    <h5>Email</h5>
    <span class="text-lightblue">${contact.email}</span>
    <h5>Phone</h5>
    <span>${contact.phone}</span>
</div>
`;
}

function closeEditContact() {
    document.getElementById("editContact").classList.add("d-none");
}

function openEditContact(i) {
    document.getElementById("editContact").classList.remove("d-none");
    document.getElementById("editContact").innerHTML = "";
    let contact = contacts[i];
    let splittedName = contact.name.split(" ");
    document.getElementById("editContact").innerHTML = `
    <div onclick="notClose(event)" class="add-contact">
                <div class="add-contact-first-part">
                    <div class="container-logo-addcontact">
                        <img src="./assets/img/Logo.png" alt="" />
                        <h2>Edit contact</h2>
                        <div class="vertikal-line-addcontact"></div>
                    </div>
                </div>
                
            <div class="add-contact-second-part">
                <div  style="background-color:${
                    contact.color
                }" class="initials-contact-body">
                    ${splittedName[0].charAt(0)}${splittedName[1].charAt(0)}
                </div>
            </div>
            <div class="add-contact-third-part">
                    <img onclick="closeEditContact()" class="close-addcontact" src="./assets/img/x-blue.png" alt="">
                    <div>
                        <input id="input_name_edit"
                            class="input_name"
                            type="text"
                            placeholder="Name" />
                    </div>
                    <div>
                        <input id="input_email_edit"
                            class="input_email"
                            type="text"
                            placeholder="Email" />
                    </div>
                    <div>
                        <input id="input_phone_edit"
                            class="input_phone"
                            type="text"
                            placeholder="Phone" />
                    </div>
                    <div class="container-button">
                        <button onclick="" class="button-create">
                            Save  
                        </button>
                    </div>
                </div>
    </div>`;
}
