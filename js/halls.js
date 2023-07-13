window.addEventListener('load', async () => {
    const params = getUrlParams();
    const hall_id = params.get("hall_id")
    const seance_id = params.get("seance_id")
    // const seance_start = params.get("seance_start")
    const film_id = params.get("film_id")
    const seanceTimeStamp = params.get("seanceTimeStamp")

    const result = await loadHallConfig(hall_id, seance_id, seanceTimeStamp)

    async function getHallConfig(config) {

        if (config !== null) {

            return config;
        }
        const info = await getOrLoadInfo()


        const halls = info.halls.result;
        for (let i = 0; i < halls.length; i++) {
            if (hall_id === halls[i].hall_id) {
                return halls[i].hall_config;
            }
        }
        return
    }
    const hallConfig = await getHallConfig(result)
    // console.log("hallConfig =" + hallConfig)




    const confStepWrapper = document.querySelector('.conf-step__wrapper'); // места которые выдала разметка
    confStepWrapper.innerHTML = hallConfig; //добавляем разметку  зала.

    const info = await getOrLoadInfo() // загрузит всю информайцю по фильмам и сеансам если она есть из локал сторедж если нет то загрузит
    const film = info.films.result.filter(f => f.film_id == film_id)[0] // ищем фильм с нужным нам film id
    const seance = info.seances.result.filter(s => s.seance_id == seance_id)[0] // ищем сеанс с правильным seance_id
    const hall = info.halls.result.filter(h => h.hall_id == hall_id)[0] // ищем зал в котором будет выбраный нами ранее hall_id

    const buyingInfoTitle = document.querySelector('.buying__info-title'); // Название фильма 
    const buyingInfoStart = document.querySelector('.buying__info-start'); // Начало сеанса 
    const buyingInfoHall = document.querySelector('.buying__info-hall'); // Название зала


    buyingInfoTitle.textContent = film.film_name; //добавляем название фильма 
    buyingInfoStart.textContent = "Начало сеанса: " + seance.seance_time; //добавляем начало сеанса 
    buyingInfoHall.textContent = hall.hall_name; //добавляем название зала




    //Выбор мест и цена за нихю

    let sum = 0; // сумма выбранных мест 
    const chairs = document.querySelectorAll(".conf-step__chair"); // находим все места в зале 
    for (let i = 0; i < chairs.length; i++) {
        if (chairs[i].classList.contains("conf-step__chair_taken") || chairs[i].classList.contains("conf-step__chair_disabled")) {
            continue; // если места куплены или они не доступны идем дальше и не реагируем на них. 
        }

        const moneyVip = Number(document.querySelector(".price-vip").textContent) // цена за вип место 
        const moneyS = Number(document.querySelector(".price-standart").textContent) // цена за стандартное место 

        chairs[i].onclick = () => {
            let price = undefined; // для счета 
            if (chairs[i].classList.contains("conf-step__chair_standart")) {
                price = moneyS;
            }
            if (chairs[i].classList.contains("conf-step__chair_vip")) {
                price = moneyVip;
            }
            if (chairs[i].classList.contains("conf-step__chair_selected")) { // счетчик суммы выбраных мест
                sum -= price;
            } else {
                sum += price;
            }
            chairs[i].classList.toggle("conf-step__chair_selected")
        }
    }

    
    const acceptinButton = document.querySelector('.acceptin-button') // кнопка забронировать 
    
    acceptinButton.onclick = async () => { // кнопка забронировать
        let chairSelected = confStepWrapper.querySelectorAll(".conf-step__chair_selected") //выбираем выбраные места 
        if (chairSelected.length === 0) {
            alert("Вы не выбрали место(а)")
            return 
           }
            const chairs = []; 
            let saveCurrentBuy = {}; // переменная  для информации о покупке на конкретныый сеанс
            chairSelected.forEach (e => {
                let parrent = e.parentElement;
                let place = null;
                let row = null; 
            
                Array.from(parrent.children).forEach((child,index) =>{ // место и ряд
                    if(child === e){
                      place = index+1;
                    }
                  })
                Array.from(parrent.parentElement.children).forEach((eParrent,index) => {
                    if(parrent === eParrent){
                      row = index+1;
                    }
                  })
                
                const chair = {row: row, place: place}; // обьек который будет хранить ряд и места
               
                chairs.push(chair); 
            })
                const r = await saleAdd(hall_id, seance_id, seanceTimeStamp, confStepWrapper.innerHTML)
                console.log(r)
                const ticketInformation = {film: film, seance: seance, hall: hall, selectedSeats: chairs, sum: sum}
                console.log(chairs);
                window.sessionStorage.setItem("ticketInformation", JSON.stringify(ticketInformation))
                window.open("payment.html", "_self")
        }
        
    

})

function getUrlParams() {
    return new URLSearchParams(window.location.search);
}

