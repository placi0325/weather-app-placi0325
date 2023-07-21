const root = document.querySelector("#root");
const body = document.querySelector("body");


const dataDiv = document.createElement('div');
dataDiv.id = "dataDiv";

// Add background
const background = document.createElement('img');
background.classList.add("bg");
background.src = "https://i.kym-cdn.com/entries/icons/original/000/023/098/1038860.jpg";
body.appendChild(background);

// Add search
const searchField = document.createElement("input");
searchField.setAttribute("list","autocomp")
searchField.id = "searchField";
searchField.type = "text";
root.appendChild(searchField);

// Add button
const addToFavButton = document.createElement("input");
addToFavButton.type = "button";
addToFavButton.value = "Add ⭐";
addToFavButton.id = "showWeather";
root.appendChild(addToFavButton);

// Add datalist
const dataList = document.createElement("datalist");
dataList.id = "autocomp";
root.appendChild(dataList);

// Add spinner
const spinner = document.createElement("img");
spinner.src = "./images/reload-cat.gif";
spinner.id = "spinner"
body.appendChild(spinner);

// Favouites list
const favDiv = document.createElement("div");
favDiv.id = "favourite";
favDiv.innerText = "⭐ Favourites ⭐"
favDiv.setAttribute("hidden","hidden");
body.appendChild(favDiv);


// Fill datalist
async function fillDatlist() {    
    const allCities = await getData(`./city.list.json`);
    await allCities.forEach(y => {
        const option = document.createElement("option");
        option.value = y.name;
        option.innerText = y.country;
        dataList.appendChild(option);
    });

    spinner.setAttribute("hidden","hidden");
}

fillDatlist();




let selectedCity = {}; 
const favCities = [];
let counter = 0;

addToFavButton.addEventListener("click", () => {
    favDiv.removeAttribute("hidden");

    if(!favCities.some(x => x.name === selectedCity.name && x.country === selectedCity.country) && Object.keys(selectedCity).length !== 0){
        let a = document.createElement('a')
        a.id =  `${counter}-fav`
        a.innerHTML = selectedCity.name + '\n'
        favDiv.appendChild(a)
        favCities.push(selectedCity);
        counter++
        a.addEventListener('click', (e) =>{
            getWeatherDataByName(e.target.innerHTML)
            setBackground(e.target.innerHTML)

        })
    }
});

searchField.addEventListener("change", e => {
    dataDiv.setAttribute("hidden","hidden");
    spinner.removeAttribute("hidden");
    const allCities = getData(`./city.list.json`);
    allCities.then(response => {
        selectedCity = response.find(x =>{ return x.name.toLowerCase() === searchField.value.toLowerCase() });        
        searchWeather();  
        spinner.setAttribute("hidden","hidden");
        dataDiv.removeAttribute("hidden");
    })   
});

function searchWeather() {
    setBackground(searchField.value);
    getWeatherData(selectedCity.coord.lat, selectedCity.coord.lon);
}

async function getData(source) {
    const response = await fetch(source);
    const json = await response.json();
    return json;
}

async function setBackground(search) {
    const options = {
    	method: 'GET',
    	headers: {
    		Authorization: '563492ad6f91700001000001ee20365510e6427ea60b735ed548ba90',
    		'X-RapidAPI-Key': '1383f6049cmshe4c9ffad3726cb0p124004jsnb5759ae403b8',
    		'X-RapidAPI-Host': 'PexelsdimasV1.p.rapidapi.com'
    	}
    };
    
    background.src = "./images/loading-seal.gif";
    await fetch(`https://pexelsdimasv1.p.rapidapi.com/v1/search?query=${search}&locale=en-US&per_page=15&page=1`, options)
    	.then(response => response.json())
    	.then(response => {
            background.src = response.photos[0].src.original;
        })
    	.catch(err => {
            console.error(err);
            background.src = "./images/error.jpg"
        });
}

async function getWeatherDataByName(name) {
    const options = {
    	method: 'GET'
    };

    await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=3bb88b8e4e0c4b3bc27f6a50f9f862f0&units=metric`, options)
    	.then(response => response.json())
    	.then(response => {
            showWeatherData(response);
        })
    	.catch(err => console.error(err));
}


async function getWeatherData(lat, lon) {
    const options = {
    	method: 'GET'
    };

    await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=3bb88b8e4e0c4b3bc27f6a50f9f862f0&units=metric`, options)
    	.then(response => response.json())
    	.then(response => {
            if(response.name !== selectedCity.name){
                getWeatherDataByName(selectedCity.name)
            }else{
            showWeatherData(response);
            }
        })
    	.catch(err => console.error(err));
}


function showWeatherData (response) { 
    dataDiv.innerHTML = "";

    const cityname = document.createElement('h1');
    cityname.innerText = response.name;
    dataDiv.appendChild(cityname)
    

    const dataGrid = document.createElement('div');
    dataGrid.id = "dataGrid";
    dataDiv.appendChild(dataGrid);

    Object.keys(response.main).forEach((x, i) => {    
        const text = document.createElement('p');
        const span2 = document.createElement('span');
        text.id = `text-${i}`;
        span2.id = `main-${i}`;
        switch (x) {
            case "humidity":
                text.innerText =`Humidity`;
                span2.innerText = `${response.main[x]}%`;
                break;
            case "pressure":
                text.innerText = `Pressure`; 
                span2.innerText =`${response.main[x]} hPa`;
                break;
            case "sea_level":
                text.innerText = `Sea Level`;
                span2.innerText = `${response.main[x]} hPa`;
                break;
            case "grnd_level":
                text.innerText = `Ground Level`;
                span2.innerText = `${response.main[x]} hPa`;
                break;
            case "temp":
                text.innerText = `Temperature`;
                span2.innerText = `${response.main[x]} °C`;
                break;
            case "feels_like":
                text.innerText = `Feels like`;
                span2.innerText = `${response.main[x]} °C`;
                break;
            case "temp_min":
                text.innerText = `Minimum \n Temperature`;
                span2.innerText = `${response.main[x]} °C`;
                break;
            case "temp_max":
                text.innerText = `Maximum Temperature`;
                span2.innerText = `${response.main[x]} °C`;
                break;
            default:
                text.innerText += `${x}: ${response.main[x]}%`;
                break;
        }
        dataGrid.appendChild(text);
        dataGrid.appendChild(span2);
    })
    const img = document.createElement('img');
    img.src = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`
    img.id = 'img'
    dataDiv.appendChild(img);
    body.appendChild(dataDiv);
}
