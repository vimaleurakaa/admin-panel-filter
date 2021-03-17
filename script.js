// const url =
//   "http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D";

const dataPane = document.getElementById("dataPane");
const infoContent = document.getElementById("info-content");
const userDataTable = document.getElementsByClassName("user");
const searchInput = document.getElementById("search-box");
const form = document.getElementById("form");
const loader = document.getElementById("loader");
let userData = [];
let userEleref = [];
let userNames = [];

//fetch data
fetch("https://a-todo-app-default-rtdb.firebaseio.com/users.json")
  .then((response) => response.json())
  .then((data) => {
    userData = data;
    loadData();
  })
  .catch((e) =>
    alert("Error fetching data.. Please check your internet connection", e)
  );

let df = new DocumentFragment();
//render user data
function loadData() {
  userData.forEach(({ id, firstName, lastName, email, phone }) => {
    loader.style.display = "none";
    let element = document.createElement("tr");
    element.setAttribute("data-email", email);
    element.innerHTML = `
        <td class="column1">${id}</td>
        <td class="column2">${firstName}</td>
        <td class="column3">${lastName}</td>
        <td class="column4">${email}</td>
        <td class="column5">${phone}</td>
  `;
    userEleref.push(element);
    userNames.push(firstName.toLowerCase());
    df.appendChild(element);
  });
  dataPane.appendChild(df);

  //event listerner for datatable
  for (let i in userEleref) {
    userEleref[i].addEventListener("click", function () {
      userEleref.forEach((element) => {
        element.classList.remove("active");
      });
      displayUserDetails(this.dataset.email);
      this.classList.add("active");
    });
  }
}

let uf = new DocumentFragment();

//Display User Details
const displayUserDetails = (email) => {
  infoContent.innerHTML = "";
  for (let i = 0; i < userEleref.length; i++) {
    if (userEleref[i].dataset.email === email) {
      let element = document.createElement("div");
      element.innerHTML = `
      <div><b>User selected:</b> ${userData[i].firstName}</div>
      <div><b>Description: </b><textarea cols="50" rows="5" readonly>${userData[i].description}</textarea></div>
       <div><b>Address:</b> ${userData[i].address.streetAddress}</div>
      <div><b>City:</b> ${userData[i].address.city}</div>
      <div><b>State:</b> ${userData[i].address.state}</div>
      <div><b>Zip:</b> ${userData[i].address.zip}</div> 
      `;
      uf.appendChild(element);
    }
  }
  infoContent.appendChild(uf);
};

//Search Results Handler
const searchFilterHandler = (inputValue) => {
  const input = inputValue.toLowerCase();
  for (let i = 0; i < userData.length; i++) {
    if (userNames[i].includes(input)) {
      userEleref[i].hidden = false;
    } else {
      userEleref[i].hidden = true;
    }
  }
  console.log(`Performance Debouncing :  ${parseInt(performance.now())} ms`);
};

searchInput.addEventListener("input", (e) => {
  e.preventDefault();
  searchFilterHandler(e.target.value);
});

// const searchFilterHandler = (inputValue) => {
//   const filter = inputValue.toLowerCase();
//   userEleref.forEach((item) => {
//     const foundMatch = [...item.getElementsByTagName("td")].some((td) => {
//       return td.innerHTML.toLowerCase().indexOf(filter) > -1;
//     });
//     if (foundMatch) {
//       item.style.display = "";
//     } else {
//       item.style.display = "none";
//     }
//   });
//   console.log(`Performance Debouncing :  ${parseInt(performance.now())} ms`);
// };
