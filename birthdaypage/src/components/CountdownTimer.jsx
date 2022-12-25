import React, { useState } from "react";

export default function CountdownTimer(){
    var d = new Date();
    d.setDate(d.getDate());
    let fullyear= d.getFullYear()

    const [year, setYear] = useState(fullyear);
    const [bursdag, setBursdag] = useState(localStorage.getItem("bursdag")==="true")


    var end = new Date('12/17/'+year+' 00:00:00');

    var _second = 1000;
    var _minute = _second * 60;
    var _hour = _minute * 60;
    var _day = _hour * 24;
    var timer;

    function showRemaining() {
        var now = new Date();
        var distance = end - now;
        if (distance <= 3) {
            setBursdag(true)
            localStorage.setItem("bursdag", "true")
            document.getElementById('countdown').innerHTML = '';
            if (distance < -(1000*60*60*24*14)){
                setYear(year+1)
                distance = end - now;
                setBursdag(false)
                localStorage.setItem("bursdag", "false")

            }
            

        }
        if (!bursdag){
        var days = Math.floor(distance / _day);
        var hours = Math.floor((distance % _day) / _hour);
        var minutes = Math.floor((distance % _hour) / _minute);
        var seconds = Math.floor((distance % _minute) / _second);

        document.getElementById('countdown').innerHTML = days + ' : ';
        document.getElementById('countdown').innerHTML += hours + ' : ';
        document.getElementById('countdown').innerHTML += minutes + ' : ';
        document.getElementById('countdown').innerHTML += seconds + '';
    }}

    timer = setInterval(showRemaining, 1000);

  return( 
    <> 
        {bursdag ? 
        <h1>Gratulerer med dagen Runar</h1> : 
        <h1>Runar har bursdag om:</h1>}
        <p aria-label=""  id="countdown"></p>
  </>
  )



}