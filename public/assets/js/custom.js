flatpickr("input[type='date']", {
    dateFormat: "Y-m-d"
});
flatpickr("input[type='time']", {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true
});