//DOM Elements
let modalBody = document.querySelector(".modal--background");

let closeButton = document.getElementById("close");
let photographerPages = document.getElementById("presentation");
let photographerIntroSection = document.getElementById("photographer-introduction");
let roundImage = document.getElementsByClassName("presentation__photographer--round");

//Close modal
if(closeButton){
    closeButton.addEventListener("click", function(){
    modalBody.style.display = "none";
});
}

//Objects
let userPage = [
    {
        site: "mimi.html",
        image: "Portrait_Nora_Small.jpg",
        id: 243,
        folder: "Mimi"
    },
    {
        site: "ellierose.html",
        image: "Architecture_Horseshoe_Small.jpg",
        id: 930,
        folder: "Ellie Rose"
    },
    {
        site: "tracy.html",
        image: "Fashion_Urban_Jungle_Small.jpg",
        id: 82,
        folder: "Tracy"
    },
    {
        site: "nabeel.html",
        image: "Travel_Outdoor_Baths_Small.jpg",
        id: 527,
        folder: "Nabeel"
    }, 
    {
        site: "rhode.html",
        image: "Fashion_Melody_Small.jpg",
        id: 925,
        folder: "Rhode"
    },
    {
        site: "marcel.html",
        image: "Travel_Tower_Small.jpg",
        id: 195,
        folder: "Marcel"
    }
]



//Get JSON file

fetch('FishEyeData.json')
    .then(function(response){
        return response.json();
    })
    //Build site pages
    .then(function(data){
        new FactoryIndexPage().photographerSite(data);
        new FactoryPhotographerIntroduction().createPhotographerIntro(data);
        new FactoryPhotographerPortfolio().createPortfolio(data);
        new DropdownMenu().activateDropdown(data);
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
        //Create photo links to photographer pages

        for (let i = 0; i < photographerData.length; i++){
            let article = document.createElement("article");
            article.className = 'presentation__photographer ' + photographerData[i].tags.join(' ');            
            article.innerHTML = `
            <a href="${userPage[i].site}?id=${photographerData[i].id}">
                    <div class="presentation__photographer--round">
                        <img src="./FishEye_Photos/Sample Photos/Photographers Favorite Photos/${userPage[i].image}" alt="">
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
        <a href="#">
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
        if(tagFilter){
            let tagButtons = tagFilter.getElementsByClassName("tag--btn");
            if(tagButtons){
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
        }

       
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

// display go to content button
class FactoryContent{
    goToContent(){
        let contentButton = document.querySelector(".content");
        if(contentButton){
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
}

//display photographer information
class FactoryPhotographerIntroduction{
    createPhotographerIntro(data){
        let myData= [];
        myData.push(data);
        let photographerData = myData[0].photographers;   
        let photographerUrl = document.location.search;
        let urlId = photographerUrl.substring(4);   
        let photographerId = photographerData.filter(photographers => photographers.id == urlId);
        let userPageId =  userPage.filter(users => users.id == urlId);
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
                <img src="./FishEye_Photos/Sample Photos/Photographers Favorite Photos/${userPageId[0].image}" alt="">
            </div>
            `
        }
        let openButton = document.getElementById("open");
        let modalName = document.querySelector(".modal__content--title");
        let submit = document.querySelector(".button--submit");
        let prenom = document.getElementById("prenom");
        let nom = document.getElementById("nom");
        let email = document.getElementById("email");
        let message = document.getElementById("message");
        // Open modal
        if(openButton){
            openButton.addEventListener("click", function(){
            modalBody.style.display = "block";
            modalName.innerHTML = `Contactez-moi <br> ${photographerId[0].name}`
        });
        }
        // print in console
        if(submit){
            submit.addEventListener("click", function(e){
                e.preventDefault();
                console.log(`Personne: ${prenom.value} ${nom.value}, Email: ${email.value}, Message: ${message.value} `);
                modalBody.style.display = "none";
            })
        }
    } 
}

// display photographer's image gallery
class FactoryPhotographerPortfolio{
    createPortfolio(data){
        let userId = document.location.search.substring(4);
        let photographerData = data.photographers;
        let mediaData = data.media;
        let photographerId = mediaData.filter(media => media.photographerId == userId);
        let folderName = userPage.filter(element => element.id == userId);
        let photographerPortfolio = document.getElementById("portfolio");
        if(photographerPortfolio){
            for(let i=0; i < photographerId.length; i++){
                let portfolioElement = document.createElement("article");
                let mediaElement = new FactoryMedia().createMedia(photographerId[i], folderName[0]);
                portfolioElement.innerHTML = `
                <a href="#">
                    <div class="portfolio__item--content">
                        ${mediaElement.outerHTML}
                    </div>
                </a>
                <div class="portfolio__text">
                    <p class="portfolio__text--title">${photographerId[i].title}</p>
                    <p class="portfolio__text--likes">${photographerId[i].likes} <i class="far fa-heart portfolio__text--heart" aria-label="likes" data-value="${photographerId[i].likes}"></i></p>
                </div>
                `;
                portfolioElement.classList.add("portfolio__item");
                photographerPortfolio.appendChild(portfolioElement);

            }
            for(let j= 0; j < photographerData.length; j++){
                let currentInfo = document.querySelector(".current-information");
                if(currentInfo){
                    currentInfo.innerHTML = `
                    <p class="current-information__likes"> <i class="fas fa-heart"></i></p>
                    <p>${photographerData[j].price}€ / jour</p>`
                }
            }
            Likes.init();
            Lightbox.init();       
        }
    }
}

// choose media element type
class FactoryMedia {
    createMedia(type, name){
        let media = null;
        if(type.hasOwnProperty('image')){
            media = new FactoryImage();
        }else if(type.hasOwnProperty('video')){
            media = new FactoryVideo();
        }
        return media.createGalleryElement(type, name);
    }
}

//create image element
class FactoryImage{
    createGalleryElement(type, name){
        let galleryImage = document.createElement('img');
        galleryImage.setAttribute('src', "./FishEye_Photos/Sample Photos/"+name.folder+"/"+type.image);    
        galleryImage.setAttribute('alt', type.title);
        galleryImage.setAttribute('role', 'button');
        galleryImage.classList.add('portfolio__item--media')
    
        return galleryImage;
    }
}

//create video element
class FactoryVideo{
    createGalleryElement(type, name){
        let galleryVideo = document.createElement('video');
        galleryVideo.setAttribute('src', "./FishEye_Photos/Sample Photos/"+name.folder+"/"+type.video);
        galleryVideo.setAttribute('role', 'button');
        galleryVideo.setAttribute('controls', 'controls');
        galleryVideo.classList.add('portfolio__item--media');
    
        return galleryVideo;
    }
} 


// Likes
class Likes {
    static init() {
        const likes = Array.from(document.querySelectorAll(".portfolio__text--likes"));
        if(likes){
            const totalLikes = likes.map(like => parseInt(like.innerText));
            new Likes(totalLikes);
        }        
    }

    //count number of likes
    constructor(totalLikes) {
        this.totalLikes = totalLikes;
        this.showLikes();
        const heart = Array.from(document.querySelectorAll(".portfolio__text--heart"));
        for(let i = heart.length-1; i >= 0; i--){
            heart[i].addEventListener("click", e => {
                e.preventDefault();
                this.countLikes(i);
            });
            heart[i].addEventListener("keypress", e => {
                if(e.key === "Enter"){
                    e.preventDefault();
                    this.countLikes(i);
                }
            });
        }
    }

    // add a like or remove a like
    countLikes(j){
        const numberLikes = document.querySelectorAll(".portfolio__text--likes");
        const hearts = document.querySelectorAll(".portfolio__text--heart");
        if(hearts[j].classList.contains("liked")){
            this.totalLikes[j]--;
            numberLikes.innerHTML = `${this.totalLikes[j]}`;
            hearts[j].classList.replace("fas", "far");
            hearts[j].classList.remove("liked");
        }else {
            this.totalLikes[j]++;
            numberLikes.innerHTML = `${this.totalLikes[j]}`;
            hearts[j].classList.replace("far", "fas");
            hearts[j].classList.add("liked");
        }
        this.showLikes();
    }

    //print total numer of likes
    showLikes() {
        let totalCount = 0;
        totalCount = this.totalLikes.reduce((a,b) => (a+b));
        const infoBox = document.querySelector(".current-information__likes");
        infoBox.innerHTML= "";
        infoBox.innerHTML = `${totalCount} <i class="fas fa-heart"></i>`;
    }
}

// Lightbox
/**
 * @property {HTMLElement} element
 * @property {string[]} sources 
 */
class Lightbox{
    static init () {
        const links = Array.from(document.querySelectorAll(".portfolio__item--media"));
        const sources = links.map(link => link.getAttribute("src"));
        if(links){
            links.forEach(link => link.addEventListener("click", e => {
                e.preventDefault()
                new Lightbox(e.currentTarget.getAttribute("src"), sources);
            }))
        }
    }

    /***
     * @param {string} src
     * @param {string[]} sources
     */
    constructor(src, sources) {
        this.element = this.buildLightbox();
        this.insertMedia(src);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.src = src;
        this.sources = sources;
        document.body.appendChild(this.element);
        document.addEventListener("keyup", this.onKeyUp);
    }

    /**
     * 
     * @param {KeyboardEvent} e 
     */

    onKeyUp(e){
        if(e.key === "Escape"){
            this.closeBox(e);
        } else if(e.key === "ArrowRight"){
            this.next(e);
        }else if(e.key === "ArrowLeft"){
            this.prev(e);
        }
    }
    /**
     * 
     * @param {MouseEvent|KeyboardEvent} e 
     */
    closeBox(e){
        e.preventDefault();
        this.element.style.display = "none";
        this.element.parentElement.removeChild(this.element);
        document.removeEventListener('keyup', this.onKeyUp)
    }

    /**
     * 
     * @param {MouseEvent|KeyboardEvent} e 
     */
    next(e) {
        e.preventDefault();
        let index = this.sources.findIndex(content => content === this.src);
        if(index >= this.sources.length-1){
            index = -1;
        }else{
            index++;
        }
        this.insertMedia(this.sources[index]);
    }

    /**
     * 
     * @param {MouseEvent|KeyboardEvent} e 
     */
    prev(e) {
        e.preventDefault();
        let index = this.sources.findIndex(content => content === this.src);
        if(index === 0){
            index = this.sources.length-1;
        }else{
            index--;
        }
        this.insertMedia(this.sources[index]);
    }

    buildLightbox(){
        const dom = document.createElement("section");
        dom.classList.add("lightbox");
        dom.innerHTML = `
        <button class="lightbox__close">Fermer</button>
        <button class="lightbox__next">Suivant</button>
        <button class="lightbox__prev">Précédent</button>
        <div class="lightbox__container"></div>
        `;
        dom.querySelector(".lightbox__close").addEventListener("click", this.closeBox.bind(this));
        dom.querySelector(".lightbox__next").addEventListener("click", this.next.bind(this));
        dom.querySelector(".lightbox__prev").addEventListener("click", this.prev.bind(this))
        return dom;
    }

    /**
     * 
     * @param {string} src 
     */
    insertMedia(src){
        const lightboxContainer = this.element.querySelector(".lightbox__container");
        lightboxContainer.innerHTML = "";
        this.src = src;
        if(lightboxContainer){
            if(src.includes(".jpg") || src.includes(".jpeg") || src.includes(".png")){
                const image = new Image();
                lightboxContainer.appendChild(image);
                image.classList.add("lightbox__media");
                image.src = src;

            }else{
                const video = document.createElement("video");
                lightboxContainer.appendChild(video);
                video.classList.add("lightbox__media");
                video.src = src;
            }
        }

    }
}


//Dropdown menu

class DropdownMenu{
    //show dropdown options
    activateDropdown(data){
        let dropBtn = document.querySelector(".dropbtn");
        let dropDownOptions = document.getElementById("dropdown__list");
        let arrowIcon = document.querySelector("#dropdown__categories i");
        if(dropBtn){
            dropBtn.addEventListener("click", (e) => {
                e.preventDefault();
                dropDownOptions.style.display = "block";
                dropBtn.style.borderRadius = "5px 5px 0 0";
                arrowIcon.classList.toggle("fa-angle-up");
                arrowIcon.classList.toggle("fa-angle-down");
            });
            this.sortBy(data);
        }
    }
    //sort media by popularity, date or title
    sortBy(data){
        let sortedMedia = [];
        let mediaData = data.media;
        let photoData = data.photographers;
        let dropdownBtn = document.querySelector(".dropbtn");
        let dropdownList = document.getElementById("dropdown__list");
        let dropdownOptions = Array.from(document.getElementsByClassName("sort-option"));
        dropdownOptions.forEach((option, index) => option.addEventListener("click", () => {
            dropdownList.style.display = "none";
            dropdownBtn.style.borderRadius = "5px";
            if(index == 0){
                dropdownBtn.innerHTML = `<p id="options-btn">Popularité</p> <i id="arrow" class="fas fa-angle-down"></i>`;

                sortedMedia = mediaData.sort((a,b) => {
                    return b.likes - a.likes;
                })
            }else if(index == 1){
                dropdownBtn.innerHTML = `<p id="date">Date</p> <i id="arrow" class="fas fa-angle-down"></i>`;

                sortedMedia = mediaData.sort((a,b) => {
                    return new Date(b.date) - new Date(a.date);
                })
            }else if(index == 2){
                dropdownBtn.innerHTML = `<p id="options-btn">Titre</p> <i id="arrow" class="fas fa-angle-down"></i>`;

                sortedMedia = mediaData.sort((a,b) => {
                    if(a.title.toLowerCase() < b.title.toLowerCase()){
                        return -1;
                    }else{
                        return 1;
                    }
                })
            }                    
            let sortedArray = {"photographers":photoData, "media":sortedMedia};
            this.sortMedia(sortedArray);
        }))    
    }
    //create a new image gallery with sorted media
    sortMedia(sortedArray){
        document.getElementById("portfolio").innerHTML = "";
        new FactoryPhotographerPortfolio().createPortfolio(sortedArray);
    }
}
