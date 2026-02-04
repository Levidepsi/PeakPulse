"use client";

import { useEffect, useState } from "react";
import "./calendar.css";

const SLOT_DATA = [
  { label: "09:00 – 11:00", start: "09:00", end: "11:00" },
  { label: "13:00 – 15:00", start: "13:00", end: "15:00" },
  { label: "15:30 – 17:30", start: "15:30", end: "17:30" },
];

interface Props {
  onDateSelect: (value: string) => void;
  onTimeSelect: (value: string) => void;
  emailSent: boolean
}

export default function AuditCalendarPage({
  onDateSelect,
  onTimeSelect,
  emailSent
}: Props) {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<{
    start: string;
    end: string;
  } | null>(null);

  // 🔥 Always derived from currentMonth + currentYear
  const monthName = new Date(currentYear, currentMonth).toLocaleString(
    "default",
    { month: "long" }
  );

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const daysArray = Array.from(
    { length: firstDayIndex + daysInMonth },
    (_, i) => (i < firstDayIndex ? null : i - firstDayIndex + 1)
  );

  const goPrevMonth = () => {
    setSelectedDay(null);
    setSelectedTime(null);
    onDateSelect("");
    onTimeSelect("");

    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    setSelectedDay(null);
    setSelectedTime(null);
    onDateSelect("");
    onTimeSelect("");

    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };
    const handleDateSelect = (day: number) => {
      setSelectedDay(day);
      setSelectedTime(null);

      const month = String(currentMonth + 1).padStart(2, "0");
      const dayStr = String(day).padStart(2, "0");

      const dateString = `${currentYear}-${month}-${dayStr}`;

      onDateSelect(dateString);
      onTimeSelect("");
    };


  const handleTimeSelect = (slot: { start: string; end: string }) => {
    setSelectedTime(slot);
    onTimeSelect(`${slot.start}-${slot.end}`);
  };
  return (
    <div className="Booking_Wrapper">
      <header className="book-header">Audit Availability</header>

      <div className="layout">
        {/* Calendar */}
        <div className="calendar">
          <div className="calendar-header">
            <button type="button" onClick={goPrevMonth}>
              &lt;
            </button>
            <h2>
              {monthName} {currentYear}
            </h2>
            <button type="button" onClick={goNextMonth}>
              &gt;
            </button>
          </div>

          <div className="weekdays">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="grid">
            {daysArray.map((day, index) => (
              <div key={index}>
                {day && (
                  <button
                    type="button"
                    className={`day ${
                      selectedDay === day ? "active" : ""
                    }`}
                    onClick={() => handleDateSelect(day)}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Slots */}
        <div className="details">
          {selectedDay ? (
            <>
              <h3>Available Slots</h3>
              <p>
                {monthName} {selectedDay}, {currentYear}
              </p>

              <div className="slots">
                {SLOT_DATA.map((slot) => (
                  <button
                    key={slot.label}
                    type="button"
                    className={`slot ${
                      selectedTime?.start === slot.start ? "active" : ""
                    }`}
                    onClick={() => handleTimeSelect(slot)}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p>Select a date to view available slots</p>
          )}
        </div>
      </div>
    </div>
  );
}
