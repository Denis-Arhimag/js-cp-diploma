window.addEventListener('load', async () => {
    const ticketInformation = JSON.parse(sessionStorage.getItem("ticketInformation"))
    console.log(ticketInformation)

    if (ticketInformation === null) {
        alert ("Места не выбраны !")
        return;
    }

    // добавляем информацию по купленым местам в разметку
    document.querySelector(".ticket__title").textContent = ticketInformation.film.film_name;

    const ticket__chairs = document.querySelector(".ticket__chairs");
    

    const a = ticketInformation.selectedSeats.map((s) => {
        return s.row + "/" + s.place;  
    });


    ticket__chairs.innerHTML = a.join(", "); // функция массива позволяет раставить между элемента масива 

    document.querySelector(".ticket__hall").textContent = ticketInformation.hall.hall_name.slice(-1); // если будет больше 9 залов будет проблема 
    document.querySelector(".ticket__start").textContent = ticketInformation.seance.seance_time;
    document.querySelector(".ticket__cost").textContent = ticketInformation.sum;

    const acceptinButton = document.querySelector(".acceptin-button")

    // acceptinButton.onclik = ()=> {

    // }
})