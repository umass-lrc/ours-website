let openText = `
  <div class="d-flex d-lg-flex justify-content-center align-items-center justify-content-lg-center align-items-lg-center" style="height: 4em; margin-bottom: 16px; border-radius: 1em; background: rgb(13,212,11); background: linear-gradient(135deg, rgba(13,212,11,1) 0%, rgba(86,209,11,1) 100%);">
    <h3 style="color: #37434d;font-weight: bold;margin-bottom: 0px;">OPEN</h3>
  </div>`;
let closedText = `
  <div class="d-flex d-lg-flex justify-content-center align-items-center justify-content-lg-center align-items-lg-center" style="height: 4em; margin-bottom: 16px; border-radius: 1em; background: rgb(13,212,11); background: linear-gradient(135deg, rgb(212,23,11) 0%, rgb(209,23,11) 100%); color: rgb(255,255,255);">
    <h3 style="font-weight: bold;margin-bottom: 0px;">CLOSED</h3>
  </div>`;

let lrc_open = true;

let date = luxon.DateTime.now().setZone('America/New_York');
let day_of_week = date.weekday; // Sunday --> 0, Monday --> 1, ..., Saturday --> 6
let hour = date.hour;
let minute = date.minute;

{% if include.hours == "main_office" %}
  {% assign hours = site.hours.main_office %}
{% else if include.hours == "tutoring" %}
  {% assign hours = site.hours.tutoring %}
{% else %}
  {% assign hours = site.hours.si %}
{% endif %}

let ranges = [
  {% for range in hours %}
    {
      "start_day": {{ range.start_day }},
      "end_day": {{ range.end_day }},
      "open_time": {% if range.open_time %} {{ range.open_time }} {% else %} undefined {% endif %},
      "close_time": {% if range.close_time %} {{ range.close_time }} {% else %} undefined {% endif %},
      "closed": {% if range.closed %} {{ range.closed }} {% else %} false {% endif %}
    },
  {% endfor %}
];

function printRange(range) {
  if (range.closed) {
    console.log(`${range.start_day} -- ${range.end_day}: CLOSED`);
  } else {
    console.log(`${range.start_day} -- ${range.end_day}: ${range.open_time} to ${range.close_time}`);
  }
}

for (const range of ranges) {
  printRange(range);
  if (range.start_day <= day_of_week && range.end_day >= day_of_week) {
    if (range.closed) {
      lrc_open = false;
      break;
    }
    else {
      lrc_open = range.open_time >= hour && range.close_time <= hour;
      break;
    }
  }
}

if (lrc_open) {
  document.getElementById("open-close-sign").innerHTML = openText;
} else {
  document.getElementById("open-close-sign").innerHTML = closedText;
}
