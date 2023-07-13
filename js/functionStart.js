async function loadMovie() {
  const response = await fetch('https://jscp-diplom.netoserver.ru/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: "event=update"
  });

  const result = await response.json();

  window.localStorage.setItem("info", JSON.stringify(result))

  return result;
}

// function saveToLocalStorage (key, value) {

// }

async function loadHallConfig(hall_id, seance_id, seanceTimeStamp) {


  timestamp = seanceTimeStamp;
  // console.log(timestamp)

  const response = await fetch('https://jscp-diplom.netoserver.ru/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },

    body: `event=get_hallConfig&timestamp=${timestamp}&hallId=${hall_id}&seanceId=${seance_id}`
  });

  const result = await response.json();
  // console.log(result)
  return result;
}

async function getOrLoadInfo() {
  let str = localStorage.getItem("info")

  if (str === null) {
    await loadMovie();
    str = localStorage.getItem("info")
  }
  const info = JSON.parse(str)
  return info;
}

// бронирование билетов 
async function saleAdd(hall_id, seance_id, seanceTimeStamp, hallConfiguration) {
  
  timestamp = seanceTimeStamp;
  console.log(timestamp)

  const response = await fetch('https://jscp-diplom.netoserver.ru/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },

    body: `event=sale_add&timestamp=${timestamp}&hallId=${hall_id}&seanceId=${seance_id}&hallConfiguration=${hallConfiguration}`
  });

  const result = await response.json();
  // console.log(result)
  return result;
}