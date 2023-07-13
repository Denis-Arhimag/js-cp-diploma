//https://github.com/VladaIsakova/js-cp-diploma-edited/   исходный проэкт с описанием 

window.addEventListener('load', async () => {
  // получаем результат запроса
  let result = await loadMovie()

  let date = new Date(); // получаем текушюю дату 
  let dayWeek = date.getDay();
  // dayWeek = 2;
  // console.log(dayWeek)
  date.setDate(date.getDate() - dayWeek + 1);
  const currentDay = dayWeek === 0 ? 6 : dayWeek - 1;
  // console.log("currentDay = " + currentDay);
  // console.log(date)
  // date.setDate(date.getDate() - 1);
  // console.log(date)

  const pageNavDayNumber = document.querySelectorAll(".page-nav__day-number");

  for (let i = 0; i < pageNavDayNumber.length; i++) {
    let time = date.getDate()
    pageNavDayNumber[i].innerHTML = time;
    date.setDate(date.getDate() + 1)
    // console.log(date);
  }

  const time = date.getDate();
  // console.log(time);



  document.querySelector('.page-nav__day_today').classList.remove('page-nav__day_today')
  const pageNavDay = document.querySelectorAll('.page-nav__day');

  document.querySelector('.page-nav__day_chosen').classList.remove('page-nav__day_chosen');
  pageNavDay[currentDay].classList.add('page-nav__day_chosen');
  pageNavDay[currentDay].classList.add('page-nav__day_today');

  const daySelected = (i) => {
    document.querySelector('.page-nav__day_chosen').classList.remove('page-nav__day_chosen')
      pageNavDay[i].classList.add('page-nav__day_chosen');
      selectedWeekDay = i; //выбранный день недели для того что бы выключить сеансы 
      // console.log("selectedWeekDay = " + selectedWeekDay);
      const diff = selectedWeekDay - currentDay; // будем доавлять к текущей дате на которую мы хотим купить билет 
      // console.log(diff);
      let selectedDate = new Date(); // для покупок в будующем
      selectedDate.setDate(selectedDate.getDate() + diff); // к текущему дню мы добавляем разность между текущим и планируемым
      selectedDate.setHours(0, 0, 0) // обнуляем на начало дня 
      console.log(selectedDate);
      selectedDate = Math.trunc(selectedDate / 1000);

      film(selectedDate)
  }

  let selectedWeekDay = -1; // currentDay
  for (let i = 0; i < pageNavDay.length; i++) {
    pageNavDay[i].onclick = () => daySelected(i) // 
  }

  function film(selectedDate) {
    let main = document.querySelector('main')
    main.innerHTML = '';

    // создаем элемент разметки с актуальными фильмами 
    let films = result.films.result
    for (let i = 0; i < films.length; i++) {
      // console.log(films[i].film_name)
      let section = document.createElement("section");
      section.classList.add("movie")
      main.appendChild(section);
      section.innerHTML = `
          <div class="movie__info">
            <div class="movie__poster">
              <img class="movie__poster-image" alt="${films[i].film_name}" src="${films[i].film_poster}">
            </div>
            <div class="movie__description">
              <h2 class="movie__title">${films[i].film_name}</h2>
              <p class="movie__synopsis">${films[i].film_description}</p>
              <p class="movie__data">
                <span class="movie__data-duration">${films[i].film_duration} минут</span>
                <span class="movie__data-origin">${films[i].film_origin}</span>
              </p>
            </div> 
          </div>  
          `
      halls(section, films[i].film_id, selectedDate)
      deleteEmptyHalls(section)
    }
  }

  // let selectedDate = new Date();
  // selectedDate.setDate(selectedDate.getDate());
  // selectedDate.setHours(0, 0, 0)
  // console.log(selectedDate);
  // selectedDate = Math.trunc(selectedDate / 1000);

  // film(selectedDate)

  daySelected(currentDay)

  function halls(section, filmId, selectedDate) {
    let halls = result.halls.result;
    for (let j = 0; j < halls.length; j++) { // проходим по обьектам зала 
      // console.log(halls[j].hall_name) // обращаемся к имени зала и встявляем его в разметку 
      let hallId = document.createElement("div"); // создаем элимент не выводим 
      hallId.classList.add("movie-seances__hall"); // присваеваем класс
      if (halls[j].hall_open !== "1") {
        continue;
      }
      // говорим что если зал открыт (тоесть занчение hall_open = 1) то создаем его 
      section.appendChild(hallId)
      hallId.innerHTML = `
            <h3 class="movie-seances__hall-title">${halls[j].hall_name}</h3>
            `
      let seancesList = document.createElement("ul") // создаем список времени в залах 
      seancesList.classList.add("movie-seances__list")
      hallId.appendChild(seancesList)
      // seancesList.innerHTML = ``;
      seances(seancesList, halls[j].hall_id, filmId, selectedDate)
    }

  }

  function seances(seancesList, hall_id, film_id, selectedDate) {
    let seances = result.seances.result; // проходим по обьектам сеанса и добавляем время
    for (let a = 0; a < seances.length; a++) {
      if (seances[a].seance_hallid === hall_id && film_id === seances[a].seance_filmid) {
        /*сравниваем что если указанный номер зала в сеансе равен  номеру 
                     зала в фильме тогда создаем тег ли и добавляем это время в теге А а так же смотрим */
        let seancesId = document.createElement("li"); // создаем ли элимент с временем фильма в теге UL (seancesList)
        seancesId.classList.add("movie-seances__time-block");


        seancesList.appendChild(seancesId)
        // seancesId.innerHTML = `
        // <a class="movie-seances__time" href="hall.html">${seances[a].seance_time}</a>
        // `
        const aTime = document.createElement("a")
        aTime.classList.add("movie-seances__time")
        const date = new Date();
        const hhMm = date.getHours() + ":" + date.getMinutes();
        // console.log(hhMm); 
        // надо обратиться к дате которая указана в разметке а это 
        if (currentDay === selectedWeekDay) {
          if (seances[a].seance_time <= hhMm) {
            aTime.classList.add("acceptin-button-disabled"); // добавляем класс не действительного сеанса 
          }
        } else if (selectedWeekDay < currentDay) {
          aTime.classList.add("acceptin-button-disabled"); // добавляем класс не действительного сеанса 
        }
        seanceTimeStamp = (seances[a].seance_start * 60) + selectedDate; // обнулены день в будующем мы добавляем начало сеанса 
        // console.log(selectedDate)
        aTime.setAttribute("href", "hall.html?hall_id=" + hall_id + "&seance_id=" + seances[a].seance_id + "&seanceTimeStamp=" + seanceTimeStamp + "&film_id=" + film_id)
        aTime.innerHTML = seances[a].seance_time;
        seancesId.appendChild(aTime);
      }
    }
  }


  function deleteEmptyHalls(section) {
    const halls = section.querySelectorAll('.movie-seances__hall');
    for (let i = 0; i < halls.length; i++) {
      const hall = halls[i];
      if (isEmpty(hall)) {
        hall.remove()
      }
    }
    // console.log(halls)
  }

  function isEmpty(hall) {
    const ul = hall.querySelector('ul.movie-seances__list')
    return !ul.hasChildNodes();
  }
})