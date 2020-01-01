const randomUserAPI = "https://randomuser.me/api/?nat=US&results=12";
const gallery = document.querySelector("#gallery");
const search = document.querySelector(".search-container");
const body = document.querySelector("body");

/********************************
 *!  API Request Section
 *********************************/

// Handle all fetch requests
async function getJSON(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (err) {
    throw err;
  }
}

// Extract json files fetched
async function getEmployees(url) {
  const peopleJSON = await getJSON(url);
  const profiles = peopleJSON.results;
  return Promise.all(profiles);
}

// Generate Card & Modal within one function
function generateHTML(data) {
  data.map(person => {
    person.phone = formatPhoneNumber(person.phone);
    person.dob.date = formatBirthday(person.dob.date);
    // GENERATE CARDS
    const section = document.createElement("div");
    section.classList.add("card");
    gallery.appendChild(section);
    section.innerHTML = `
            <div class="card-img-container">
                <img class="card-img" src=${person.picture.large} alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
                <p class="card-text">${person.email}</p>
                <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
            </div>
    `;

    // GENERATE MODALS
    const modal = document.createElement("div");
    modal.classList.add("modal-container", "match");
    modal.setAttribute("style", "display: none");
    body.appendChild(modal);
    modal.innerHTML = `
              <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src=${person.picture.large} alt="profile picture">
                    <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
                    <p class="modal-text">${person.email}</p>
                    <p class="modal-text cap">${person.location.city}</p>
                    <hr>
                    <p class="modal-text">${person.phone}</p>
                    <p class="modal-text">${person.location.street.number} ${person.location.street.name} ${person.location.city} ${person.location.state} ${person.location.postcode}</p>
                    <p class="modal-text">Birthday: ${person.dob.date}</p>
                </div>
              </div>
      
              <div class="modal-btn-container">
                  <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                  <button type="button" id="modal-next" class="modal-next btn">Next</button>
              </div>
          `;
  });
}

// Call getEmployees() on screen
getEmployees(randomUserAPI)
  .then(generateHTML)
  .catch(err => {
    gallery.innerHTML = "<h3>We're sorry, something went wrong!</h3>";
    console.log(err);
  });

/********************************
 *!  Event-listener Section
 *********************************/

// CARDS IN GALLERY
gallery.addEventListener("click", e => {
  // if a target is not an empty space in the div with class "gallery", (to prevent console err)
  if (e.target.className !== "gallery") {
    // find a closest div with the class name 'card'
    const selectedCardDiv = e.target.closest(".card");
    // target 'name' inside the div
    const selectedCardName = selectedCardDiv.querySelector("#name");
    // target all 'name's inside '.modal' divs
    const modalNameDiv = document.querySelectorAll(".modal #name");
    for (let i = 0; i < modalNameDiv.length; i++) {
      // shows a modal div matches what user clicked
      if (modalNameDiv[i].textContent === selectedCardName.textContent) {
        const matchingModal = modalNameDiv[i].closest(".modal-container");
        matchingModal.removeAttribute("style");
        // set a class for NEXT PREV button
        matchingModal.classList.add("current-modal");
      }
    }
  }
});

// CLOSING MODAL
body.addEventListener("click", e => {
  const currentModal = document.querySelector(".current-modal");
  if (currentModal) {
    // MODAL CLOSER: close the activated modal if the target is a close button or contains 'x' or outside of the modal
    if (
      e.target.className === "modal-close-btn" ||
      e.target.textContent === "X" ||
      e.target.className.includes("modal-container")
    ) {
      const modalDiv = e.target.closest(".modal-container");
      modalDiv.setAttribute("style", "display: none");
      modalDiv.classList.remove("current-modal");
    }
  }
});

// PREV & NEXT MODAL
body.addEventListener("click", e => {
  //gather matching modal divs
  const matchModalDivs = document.querySelectorAll(".match");
  // target current div
  const currentModalDiv = document.querySelector(".current-modal");
  // PREVIOUS MODAL
  if (
    // if the target includes the class name "modal-prev" and not the first matching modal,
    e.target.className.includes("modal-prev") &&
    currentModalDiv !== matchModalDivs[0]
  ) {
    for (let i = 0; i < matchModalDivs.length; i++) {
      const currentModal = matchModalDivs[i];
      const prevModal = matchModalDivs[i - 1];
      if (matchModalDivs[i].className.includes("current-modal")) {
        currentModal.setAttribute("style", "display: none");
        currentModal.classList.remove("current-modal");
        // setting for PREV. sibling MODAL
        prevModal.removeAttribute("style");
        prevModal.classList.add("current-modal");
      }
    }
  }
  // NEXT MODAL
  if (
    // if the target includes the class name "modal-next" and not the last matching modal,
    e.target.className.includes("modal-next") &&
    currentModalDiv !== matchModalDivs[matchModalDivs.length]
  ) {
    for (let i = 0; i < matchModalDivs.length; i++) {
      const currentModal = matchModalDivs[i];
      const nextModal = matchModalDivs[i + 1];
      if (matchModalDivs[i].className.includes("current-modal")) {
        currentModal.setAttribute("style", "display: none");
        currentModal.classList.remove("current-modal");
        console.log(nextModal);
        nextModal.removeAttribute("style");
        nextModal.classList.add("current-modal");
      }
    }
  }
});

/********************************
 *!  DATA Reformat with RegEx
 *********************************/

// Function to reformat given phone number data
function formatPhoneNumber(num) {
  const number = num.match(/\d/g, "");
  const joinNumber = number.join("");
  const regex = /^(\d{3})(\d{3})(\d{4})$/;
  return joinNumber.replace(regex, "($1) $2-$3");
}
// Function to reformat given birthday data
function formatBirthday(day) {
  const birthday = day.match(/\d/g, "");
  const joinBirthday = birthday.join("");
  // extract only first 8 digits
  const extractBirthday = joinBirthday.substring(0, 8);
  const regex = /^(\d{4})(\d{2})(\d{2})$/;
  return extractBirthday.replace(regex, "$3/$2/$1");
}

/********************************
 *!  Search Section
 *********************************/

// Search Container
const form = document.createElement("form");
form.setAttribute("action", "#");
form.setAttribute("method", "get");
search.appendChild(form);
form.innerHTML = `
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
`;

// Live-search function
const searchInput = document.querySelector("#search-input");
searchInput.addEventListener("keyup", e => {
  const nameInCards = document.querySelectorAll(".card #name");
  const nameInModals = document.querySelectorAll(".modal-container #name");
  const userInput = e.target.value.toLowerCase();
  for (let i = 0; i < nameInCards.length; i++) {
    const nameCardDiv = nameInCards[i];
    const name = nameCardDiv.textContent.toLowerCase();
    const cardDiv = nameCardDiv.closest(".card");
    const nameModalDiv = nameInModals[i];
    const modalDiv = nameModalDiv.closest(".modal-container");
    if (name.includes(userInput)) {
      cardDiv.removeAttribute("style");
      modalDiv.classList.add("match");
    } else {
      cardDiv.setAttribute("style", "display: none");
      modalDiv.classList.remove("match");
    }
  }
});
