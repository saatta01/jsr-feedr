// This feeder app will give a user the ability to toggle through three different news feeds

// URLs for APIs
const baseUrl = 'https://newsapi.org/v2/top-headlines?sources=',
      key = '&apiKey=e4c8b73f3040480cbe0815cc7487d242&pagesize=20';


// DOM elements
const mainDiv = document.getElementById('main'),
      navHeader = document.querySelector('nav ul > li a'),
      navDropdowns = document.querySelectorAll('nav ul li ul li a'),
      popup = document.getElementById('popUp'),
      closeBtn = document.querySelector('.closePopUp'),
      logo = document.querySelector('h1'),
      searchField = document.getElementById('search'),
      searchBtn = searchField.querySelector('a');

// xhr object creation
const xhr = new XMLHttpRequest();

// create an array of sources for our news feed - right now, we are only doing three
const sources = ['Wired', 'IGN', 'Ars Technica'];

// let's loop over every li in our dropdown to change the content and set the functionality.
navDropdowns.forEach((currentValue, index) => {
  currentValue.innerText = sources[index];

  currentValue.addEventListener('click', function() {
    event.preventDefault;
    let source = sources[index].toLowerCase(); // our API wants our news source lowercased

    APICall(source);

  });
});

// if the user clicks on the logo, let's load ALL the sources!
logo.addEventListener('click', function() {
  APICall('all');
});

// if the user clicks on the search, let's open and close it
searchBtn.addEventListener('click', function() {
  if(searchField.classList.contains('active')) {
    searchField.classList = '';
  } else {
    searchField.classList = 'active';
  }
})

// make the API call per news source
function APICall(source) {
  // make sure any spaces get turned to dashes!
  source = source.replace(/\s/g , "-");

  // if we want ALL of our feeds - let's pass that array through to the API the way it wants them
  if(source === "all") {
    source = sources.join(","); // converts the array to string, separating each item with a comma
    source = source.toLowerCase(); // converts our new string to lowercase
    source = source.replace(/\s/g , "-");
  }
  // until we have data, let's show the loader
  popup.classList = "loader";

  xhr.open('GET', baseUrl + source + key);
  xhr.send();
  xhr.onerror = errorHandler;
  xhr.onload = successHandler;
}

function errorHandler() {
  console.log("something went wrong");
}

// put our data in the DOM
function successHandler() {
  // once we have data, put the hidden class back on our pop up
  popup.classList = "hidden";
  let newsData = JSON.parse(xhr.responseText);
  let modalBtns = [];

  // clear out our inner div for the next feed
  mainDiv.innerHTML = '';

  // for every article we get back, let's make some html
  for(let i = 0; i < newsData.totalResults; i++) {
    let article = document.createElement('article'); // create an article element

    // grab all of the content we will need from the news sources
    let headline = newsData.articles[i].title,
        author = newsData.articles[i].author,
        sourceName = newsData.articles[i].source.name,
        url = newsData.articles[i].url,
        imgUrl = newsData.articles[i].urlToImage,
        pubTime = new Date(newsData.articles[i].publishedAt);

    article.classList = 'article';
    article.innerHTML = `<section class="featuredImage">
                          <img src="${imgUrl}" alt="" />
                            </section>
                            <section class="articleContent">
                                <a href="#"><h3>${headline}</h3></a>
                                <h6>${author} Published at: ${pubTime.toUTCString()}</h6>
                            </section>
                            <section class="impressions">
                              ${sourceName}
                            </section>
                        <div class="clearfix"></div>`
    mainDiv.appendChild(article);

    // update our news source on the top bar
    navHeader.innerHTML = `News Source: <span>${sourceName}</span>`;

    // push out our finished modal buttons that are now in the DOM
    modalBtns.push(article.querySelector('.articleContent a'));
  }
  // now that we have our data and have created our dom elements, call buttonAction and pass those as arguments
  buttonAction(newsData, modalBtns);
}

// open modal on button click
function buttonAction(modalData, modalBtns) {

  // add this functionality on each of the buttons we passed through from our success handler
  modalBtns.forEach((currentValue, index) => { currentValue.addEventListener('click', function() {
    event.preventDefault;
      popUp.classList = ''; // removes "hidden" and "loading"
      popUp.querySelector('h1').innerText = modalData.articles[index].title;
      popUp.querySelector('p').innerText = modalData.articles[index].description;
      popUp.querySelector('.popUpAction').href = modalData.articles[index].url;
  });
});
  // rig up our close button
  closeBtn.addEventListener('click', function() {
    event.preventDefault;
    popUp.classList = 'hidden';
  })
}

// start the app in the loading state
popup.classList = "loader";

// this all loads too fast! So let's put a timeout function to show the loader icon and load them when the page loads!
window.setTimeout(function() { APICall('all'); }, 1000);


