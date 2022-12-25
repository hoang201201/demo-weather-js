const API_URL = (cityName) => {
    return `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=e1c1b36106a885c64c2f31296dfff0ba&lang=vi`
}

const nameInput = document.querySelector(".search-city")
const srcBtn = document.querySelector(".search-btn")
const listDetail = document.querySelector(".list-detail")
const nameCity = document.querySelector('.name-city')
const cityList = document.querySelector('.city-list')

const app = {
    cityName: 'Hanoi',
    city: [],
    renderCityList: function() {
        let htmls = app.city.map((city) => {
            return `<p class="light-text suggestion citySuggest">${city}</p>`
        })

        cityList.innerHTML = htmls.join('');
    },
    renderList: (data) => {
        let html = `
            <div class="row px-3">
            <p class="light-text">Mây</p>
            <p class="ml-auto">${data.clouds.all}%</p>
            </div>
            <div class="row px-3">
                <p class="light-text">Độ ẩm</p>
                <p class="ml-auto">${data.main.humidity}%</p>
            </div>
            <div class="row px-3">
                <p class="light-text">Gió</p>
                <p class="ml-auto">${data.wind.speed}</p>
            </div>
            <div class="row px-3">
                <p class="light-text">Tầm nhìn xa</p>
                <p class="ml-auto">${data.visibility}m</p>
            </div>
        `
        listDetail.innerHTML = html
    },
    renderName: (data) => {
        let tempK = KtoC(data.main.temp);
        let info = upCase(data.weather[0].description)
        let html = `
            <h1 class="large-font mr-3">${tempK}&#176;</h1>
            <div class="d-flex flex-column mr-3 ">
                <h2 class="mt-3 mb-0 ">${data.name}</h2> <small class="timeClock"></small>
            </div>
            <div class="d-flex flex-column text-center">
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" class="icon fa fa-sun-o mt4"/></h3> <small class="description">${info}</small>
            </div>
        `
        nameCity.innerHTML = html
    },
    render: function(data) {
        console.log(data)
        app.renderList(data)
        app.renderName(data)
        app.renderCityList()
    },

    handleEvent: function() {
        let citySug = document.querySelector('.citySuggest')
        //Nút tìm kiếm thành phố
        srcBtn.onclick = function(e) {
            if(e.target.closest('.search-btn')) {
                if(nameInput.value != '') {
                    app.cityName = nameInput.value;
                    if(app.city.length <= 2) {
                        app.city.push(app.cityName);
                    } else if(app.city.length > 2) {
                        app.city.shift()
                        app.city.push(app.cityName);
                    }
                }
                app.getWeatherByCity(app.cityName, app.render)
            }
        }
        //Các thành phố trên thanh gợi ý
        citySug.onclick = function() {
            app.cityName = citySug.innerHTML;
            app.getWeatherByCity(app.cityName, app.render)
        }
    },

    getWeatherByCity: function(cityName, callBack) {
        fetch(API_URL(cityName))
        .then(function(resp) {
            return resp.json()
        })
        .then(callBack)
    },

    start: function() {
        this.getWeatherByCity(this.cityName, this.render)
        this.handleEvent()
    }
}

function upCase(str) {
    let arr = str.split('');
    let temp = arr[0].toUpperCase();
    arr.splice(0,1,temp)
    return arr.join('')
}

function KtoC(K) {
    return Math.floor(K - 273,15) ;
}

function showTime(){
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
    var day = date.toString().split(' ')
    var session = "AM";
    
    if(h == 0){
        h = 12;
    }
    
    if(h > 12){
        h = h - 12;
        session = "PM";
    }
    
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    var time = `${h}:${m}:${s} ${session} - ${day[0]}day, ${day[2]} ${day[1]} ${day[3]}`;
    
    let clock = document.querySelector('.timeClock')
    if(clock) {
        clock.innerText = time;
        clock.textContent = time;
    }
    
    setTimeout(showTime, 1000);
}

app.start();


setTimeout(()=>{
    showTime()
}, 4000)
