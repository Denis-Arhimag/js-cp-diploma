window.addEventListener('load', async () => {

    // document.querySelector('.ticket__info-qr').append(QRCreator('Привет, Мир!').result);

    const ticketInformation = JSON.parse(sessionStorage.getItem("ticketInformation"))
    // console.log(ticketInformation)

    if (ticketInformation === null) {
        alert("Билеты не забронированы !")
        return;
    }
    const a = ticketInformation.selectedSeats.map((s) => {
        return s.row + "/" + s.place;
    });
    // создаем и передаем str в функцию кьюаркода
    str = ticketInformation.hall.hall_name + ", места " + a.join(", ");
    document.querySelector('.ticket__info-qr').append(QRCreator(str).result);

    document.querySelector(".ticket__title").textContent = ticketInformation.film.film_name;
    document.querySelector(".ticket__chairs").textContent = a.join(", ");
    document.querySelector(".ticket__hall").textContent = ticketInformation.hall.hall_name.slice(-1); // если будет больше 9 залов будет проблема 
    document.querySelector(".ticket__start").textContent = ticketInformation.seance.seance_time;
})