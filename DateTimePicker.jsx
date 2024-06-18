import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { isWeekend } from "date-fns";
import Swal from "sweetalert2";
import "./MyDateTimePicker.css";

function MyDateTimePicker() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [confirmedDate, setConfirmedDate] = useState(null);

  // Update current date every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Handle date change in DatePicker
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Confirm selected date and time
  const confirmDate = () => {
    if (selectedDate) {
      Swal.fire({
        title: "Confirm Date and Time",
        html: `Do you want to select ${formatDateForSwal(selectedDate)}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          setConfirmedDate(selectedDate);
        }
      });
    } else {
      Swal.fire({
        title: "Select a Date and Time",
        icon: "error",
        timer: 1500,
        timerProgressBar: true,
      });
    }
  };

  // Format date for display in 12-hour format with seconds
  const formatDate = (date) => {
    const formattedDate = `${date.getDate()} / ${
      date.getMonth() + 1
    } / ${date.getFullYear()}`;
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format

    return `${formattedDate} - Time ${formattedHours}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${ampm}`;
  };

  // Format date for Swal alert message without seconds
  const formatDateForSwal = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format

    return `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} - Time ${formattedHours}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;
  };

  // Function to check if date is a weekend
  const isWeekendDay = (date) => {
    return isWeekend(date);
  };

  // Function to filter weekends from DatePicker
  const filterWeekends = (date) => {
    return !isWeekendDay(date);
  };

  // Generate array of important dates to highlight
  const importantDays = [20, 21];
  const generateHighlightDates = () => {
    const currentYear = new Date().getFullYear();
    const dates = [];

    for (let month = 0; month < 12; month++) {
      importantDays.forEach((day) => {
        dates.push(new Date(currentYear, month, day));
      });
    }

    return dates;
  };

  const highlightImportantDates = generateHighlightDates();

  return (
    <div className="dateTimePickerContainer">
      <h2 className="pickerTitle">Date Time Picker</h2>

      <p>
        Today -{" "}
        <span className="dateTimeDisplay">{formatDate(currentDate)}</span>
      </p>

      <DatePicker
        inline
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy - hh:mm aa"
        filterDate={filterWeekends}
        showTimeSelect
        timeIntervals={10}
        timeFormat="hh:mm aa"
        highlightDates={highlightImportantDates}
      />

      <div className="buttonContainer">
        <button className="confitmBtn" onClick={confirmDate}>
          Book Appointment
        </button>
      </div>

      {confirmedDate && (
        <div className="resultContainer">
          <p className="bookingResult">
            Appointment Booked on {formatDateForSwal(confirmedDate)} 📆
          </p>
          <p className="bookingResult2">Looking Forward to see you soon 🎫</p>
        </div>
      )}
    </div>
  );
}

export default MyDateTimePicker;
