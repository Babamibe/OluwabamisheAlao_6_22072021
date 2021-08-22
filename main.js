//DOM Elements
const modalBody = document.querySelector(".modal--background");
const openButton = document.getElementById("open");
const closeButton = document.getElementById("close");
let photographerPages = document.getElementById("presentation");
let photographerIntroSection = document.getElementById("photographer-introduction");
let roundImage = document.getElementsByClassName("presentation__photographer--round");
console.log(roundImage)


//Objects

let userPage = [
    {
        site: "mimi.html",
        image: "Portrait_Nora_Small.jpg",
        bgpath: "url('../FishEye_Photos/Sample Photos/Photographers Favorite Photos/Portrait_Nora_Small.jpg')"
    },
    {
        site: "ellierose.html",
        image: "Architecture_Horseshoe_Small.jpg",
        bgpath: "url('../FishEye_Photos/Sample Photos/Photographers Favorite Photos/Architecture_Horseshoe.jpg')"
    },
    {
        site: "tracy.html",
        image: "Fashion_Urban_Jungle_Small.jpg",
        bgpath: "url('../FishEye_Photos/Sample Photos/Photographers Favorite Photos/Fashion_Urban_Jungle_Small.jpg')"
    },
    {
        site: "nabeel.html",
        image: "Travel_Outdoor_Baths_Small.jpg",
        bgpath: "url('../FishEye_Photos/Sample Photos/Photographers Favorite Photos/Travel_Outdoor_Baths_Small.jpg')"
    }, 
    {
        site: "rhode.html",
        image: "Fashion_Melody_Small.jpg",
        bgpath: "url('../FishEye_Photos/Sample Photos/Photographers Favorite Photos/Fashion_Melody_Small.jpg')"
    },
    {
        site: "marcel.html",
        image: "Travel_Tower_Small.jpg",
        bgpath: "url('../FishEye_Photos/Sample Photos/Photographers Favorite Photos/Travel_Tower_Small.jpg')"
    }
]

// Open modal

if(openButton){ 
    openButton.addEventListener("click", function(){
        modalBody.style.display = "block";
    });
}

//Close modal
if(closeButton){
    closeButton.addEventListener("click", function(){
    modalBody.style.display = "none";
});
}

//Get JSON file

fetch('FishEyeData.json')
    .then(function(response){
        return response.json();
    })
    //Build site pages
    .then(function(data){
        new FactoryIndexPage().photographerSite(data);
        new FactoryPhotographerIntroduction().createPhotographerIntro(data);
        new FactoryFilter().activateTag();
        new FactoryContent().goToContent();
    })
    .catch(function(err){
        console.log(err);
    });

//Add photographer pages to homepage 
 
class FactoryIndexPage { 
    photographerSite(data){
        let myData= [];
        myData.push(data);
        let photographerData = myData[0].photographers;
        let mediaData = myData[0].media;
        console.log(photographerData);
        console.log(mediaData);
        //Create photo links to photographer pages
        console.log("photographePages", photographerPages)
        for (let i = 0; i < photographerData.length; i++){
            let article = document.createElement("article");
            article.className = 'presentation__photographer ' + photographerData[i].tags.join(' ');            
            article.innerHTML = `
            <a href="${userPage[i].site}?id=${photographerData[i].id}">
                    <div class="presentation__photographer--round">
                        <img src="../FishEye_Photos/Sample Photos/Photographers Favorite Photos/${userPage[i].image}">
                    </div>
                    <h2>${photographerData[i].name}</h2>
                </a>
                <div class="presentation__text">
                    <p class="presentation__text--location">${photographerData[i].city} , ${photographerData[i].country}</p>
                    <p class="presentation__text--motto">${photographerData[i].tagline}</p>
                    <p class="presentation__text--price">${photographerData[i].price}€/jour</p>
                </div>
                ${tags(photographerData[i].tags)}        
                
            `;
            if(photographerPages){photographerPages.appendChild(article)}else{return photographerData[i].id};
        }
    }
}


//Create tags   
function tags(tags){
    return `
    <ul>
    ${tags.map(tag => `
    <li class="tag" data-filter="${tag}">
        <a href="">
            #${tag}
        </a>
    </li>`).join("")}
    </ul>
    `;
}

// Filter photographer pages according to tags
class FactoryFilter{
    //select tags and sort articles
    activateTag(){
        let articleItem = document.querySelectorAll(".presentation__photographer");
        let tagFilter = document.getElementById("tag-filter");
        let tagButtons = tagFilter.getElementsByClassName("tag--btn");
            for(let i = 0; i < tagButtons.length; i++){
                tagButtons[i].addEventListener("click", function(){
                    tagButtons[i].classList.toggle("active")
                    
                })                       
            }
            tagFilter.addEventListener("click", event => {
                let classValue = event.target.classList.value;
                this.sortArticles(articleItem);
            })        
    }

    //return active tags
    filterTag(){
        let selectedFilters = document.querySelectorAll('ul li.active');
        let selectedFiltersArray = [];
        selectedFilters.forEach(function(selection){
            selectedFiltersArray.push(selection.getAttribute('data-filter'));
        })
        return selectedFiltersArray;
    }
    
    // check active tags class 
    compareFilterValue(item){
        let activeTags = this.filterTag();
        let classListValue = item.classList.value;
        let currentClasses = classListValue.split(' ');
        let positiveMatch = activeTags.filter(
            c => currentClasses.includes(c)
        );
        return activeTags.length == positiveMatch.length;
    }
    //display articles according to active tags
    sortArticles(articleItem){
        articleItem.forEach((item) => {
            if(this.compareFilterValue(item)){
                item.style.display = 'block';
            }else{
                item.style.display = 'none';
            }
            
        });
    }
}

class FactoryContent{
    goToContent(){
        let contentButton = document.querySelector(".content");
        window.addEventListener("scroll", function(){
            let position = window.scrollY;
            if(position > 50) {
                contentButton.style.display = "block";
            }else{
                contentButton.style.display = "none";
            }
        })
    }
}

//display photographer information
class FactoryPhotographerIntroduction{
    createPhotographerIntro(data){
        let myData= [];
        myData.push(data);
        let photographerData = myData[0].photographers;
        console.log(photographerData)
        let mediaData = myData[0].media;
        let photographerUrl = document.location.search;
        let urlId = photographerUrl.substring(4);  
        console.log("message", urlId)      
        let photographerId = photographerData.filter(photographers => photographers.id == urlId);
        console.log("test" ,photographerId[0])
        let photographerIntro = document.getElementById("introduction");
        if(photographerIntro){
            photographerIntro.innerHTML = `
            <article class="introduction__text">
                <div class="introduction__text--contact">
                    <h1>${photographerId[0].name}</h1>
                    <button id="open" class="button button--modal">Contactez-moi</button>
                </div>
                <p class="presentation__text--location">${photographerId[0].city}, ${photographerId[0].country}</p>
                <p class="introduction__text--motto">${photographerId[0].tagline}</p>
                ${tags(photographerId[0].tags)}             
            </article>
            <div class="presentation__photographer--round">
                <img src="../FishEye_Photos/Sample Photos/Photographers Favorite Photos/${userPage[0].image}" alt="">
            </div>
            `
        }

    }    
}


let FactoryMedia = function(){
    this.createMedia = function(type){
        let media;
        if(type === 'image'){
            media = new FactoryImage;
        }else if(type === 'video'){
            media = new FactoryVideo;
        }
        media.type = type;
        return media;
    }
}

let FactoryImage = function(element){
    let galleryImage = document.createElement('img');
    galleryImage.setAttribute('src', element.image);    
    galleryImage.setAttribute('alt', element.alt);
    galleryImage.setAttribute('role', 'button');
    galleryImage.classList.add('portfolio__item--content')

    return galleryImage;
}

let FactoryVideo = function(element){
    let galleryVideo = document.createElement('video');
    galleryVideo.setAttribute('src', element.video);
    galleryVideo.setAttribute('role', 'button');
    galleryVideo.classList.add('portfolio__item--content');

    return galleryVideo;
}


//Dropdown menu
/*document.getElementById("dropDown").addEventListener("click", activateDropdown);

function activateDropdown(event) {
    event.preventDefault();
    document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }*/