// Requirements
// Fill the app feed with articles from a variety of sources
// when the user selects an article's title, show a popUp
// article content is visible in popup
// read more from [source of article] button should be present in popUp
// when user selects source in dropdown, replace the content of app feed with articles from new sources
// Display loading pop up when user starts app and when user selects new sources. Hide upon successful loads
// Add error messages if the app cannot load from selected Feed

//my dude Feed- tom hanks feed that changes his name to my dude
// almost spoilers [redacted] Feed
// game news

//Relevant dom elements to manipulate: news source span, news source lis, article,featuredImage,
//article title, article link, article category, impressions

//article dom elements
const mainFeed = document.querySelector('#main');
const articles = document.querySelectorAll('.article');
const featuredImage = document.querySelector('.featuredImage img');
const articleLink = document.querySelector('.articleContent a');
const articleTitle = document.querySelector('.articleContent h3');
const articleCategory = document.querySelector('.articleContent h6');
const impressions = document.querySelector('.impressions');

//navigation dom elements
const newsSourceDropDown = document.querySelectorAll('nav ul li ul li');
const currentNewsSource = document.querySelector('nav ul li a span');
const newsSourceLists = document.querySelectorAll('nav ul li ul li');
const searchBar = document.querySelector('#search');
const searchInput = document.querySelector('input');

//popup dom elements
const popup = document.querySelector('#popUp');
const popupX = document.querySelector('.closePopUp');

const xhr = new XMLHttpRequest();
const API_KEY = 'bdaee733f58d4d8e8716f97c8b30fb29';
const BASE_URL = `https://newsapi.org/v2/everything?apiKey=${API_KEY}&q=`


//event listeners
//dropdown clicks
document.addEventListener('DOMContentLoaded', function(){
  mainFeed.innerHTML = "";
  getNews("video game OR gaming&language=en");
});

newsSourceDropDown[0].addEventListener('click', function(){
  mainFeed.innerHTML = "";
  currentNewsSource.innerText = newsSourceDropDown[0].innerText;
  getNews("video game OR gaming&language=en");
});

newsSourceDropDown[1].addEventListener('click', function(){
  mainFeed.innerHTML = "";
  currentNewsSource.innerText = newsSourceDropDown[1].innerText;
  getNews('"Tom Hanks"&language=en');
});

newsSourceDropDown[2].addEventListener('click', function(){
  mainFeed.innerHTML = "";
  currentNewsSource.innerText = newsSourceDropDown[2].innerText;
  //entertainment-weekly, contains words = "dies"
  getNews('"baby goat"&language=en');
});

popupX.addEventListener('click', function(){
  popup.classList.add('hidden');
})


//necessary fields: article image (urlToImage), article title(title), article author (author), article date(publishedAt)
//article source(name), article description(description), article link(url)
function getNews(searchTerm) {
  xhr.open('GET', `${BASE_URL}${searchTerm}`);
  xhr.send();
  xhr.onload = onSuccess;
  xhr.onerror = onError;
}

function onSuccess() {
  console.log(xhr.status);
  if(xhr.status >= 200 && xhr.status < 300) {
    popup.classList.add('loader');
    popup.classList.remove('hidden');
    runLoadingIcon();
    const results = JSON.parse(xhr.responseText);
    const articleArray = results.articles;
    articleArray.forEach(function(currentVal){
      const htmlArticleSegment = document.createElement('article');
      const tomHanksStartPosition = currentVal.title.search("Tom Hanks");
      // console.log(tomHanksPosition);
      if (tomHanksStartPosition > -1) {
        currentVal.title = currentVal.title.replaceAt(tomHanksStartPosition,"My Dude", "Tom Hanks");
        console.log(currentVal.title);
      }
      htmlArticleSegment.innerHTML = `<article class="article">
        <section class="featuredImage">
          <img src="${currentVal.urlToImage}" alt="article photo" />
        </section>
        <section class="articleContent">
            <a href="#"><h3>${currentVal.title}</h3></a>
            <h6>${currentVal.publishedAt}</h6>
        </section>
        <section class="impressions">
          ${currentVal.source.name}
        </section>
        <div class="clearfix"></div>
      </article>`;
      mainFeed.appendChild(htmlArticleSegment);
    });
    console.log(results);

    mainFeed.addEventListener('click', function(event){
      if(event.target && event.target.closest('.articleContent')) {
       // const element = event.target;
       // console.log(element);
       const childArticleNode = event.target.closest('article');
       const parentNode = childArticleNode.parentNode.parentNode;
       console.log(childArticleNode);
       console.log(parentNode);
       const indexOfClickedArticle = Array.prototype.indexOf.call(parentNode.children, childArticleNode.parentNode);
       //make popup visible and add relevant Content
       popup.classList.remove('hidden', 'loader');
       popup.querySelector('h1').innerText = articleArray[indexOfClickedArticle].title;
       popup.querySelector('p').innerText = articleArray[indexOfClickedArticle].description;
       popup.querySelector('.popUpAction').href = articleArray[indexOfClickedArticle].url;

      }
    }, false);
  } else {
    console.log('oops, we have a' + xhr.status + ". Please contact no one");
  }
}

function onError() {
  console.log('something went wrong');
}

// //event listener for clicking on the search icon
// searchBar.addEventListener('click', function(){
//   event.preventDefault();
//   searchBar.classList.add('active')
// });
//
// //event listener for entering search term
// searchInput.addEventListener('submit', function(){
//   event.preventDefault();
//   searchBar.classList.remove('active');
//   searchInput.value = '';
//   getNews(searchInput.value);
// });


String.prototype.replaceAt=function(index, replacement, originalWord) {
    const stringCharDifference = originalWord.length - replacement.length;
    console.log(stringCharDifference);
    return this.substr(0, index) + replacement + (this.substr(index + replacement.length + stringCharDifference));
}

//hide loading icon
function runLoadingIcon() {
  setTimeout(function(){
    popup.classList.remove('loader');
    popup.classList.add('hidden');
  }, 800);
  // popup.classList.remove('loader');
}
