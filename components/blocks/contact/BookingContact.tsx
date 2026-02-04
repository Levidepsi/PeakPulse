/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import "./calendar.css";
import { set } from "sanity";

const SLOT_DATA = [
  { label: "09:00 – 11:00", start: "09:00", end: "11:00" },
  { label: "13:00 – 15:00", start: "13:00", end: "15:00" },
  { label: "15:30 – 17:30", start: "15:30", end: "17:30" },
];

interface Props {
  onDateSelect: (value: string) => void;
  onTimeSelect: (value: string) => void;
  emailSent: boolean;
  selectedDate: string
}

export default function AuditCalendarPage({
  onDateSelect,
  onTimeSelect,
  emailSent,
  selectedDate
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

  const [bookedSlots, setBookedSlots] = useState<any[]>([]);
  const [daySlot, setDaySlot] = useState<any>(null);

  const newDay = new Date(daySlot?.updated).getUTCDate()

  useEffect(() => {
    if (!selectedDay) return;

    fetch("/api/google/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year: currentYear,
        month: currentMonth,
        day: selectedDay,
      }),
    })
      .then(res => res.json())
      .then(data => {
        setBookedSlots(Array.isArray(data.bookings) ? data.bookings : []);
        setDaySlot(data.dayData);
      })
      .catch(() => setBookedSlots([]));
  }, [currentMonth, currentYear, selectedDay]);
  
  const isSlotBooked = (slot: { start: string; end: string }) => {
    if (!Array.isArray(bookedSlots)) return false;

    return bookedSlots.some(b => {
      if (!b?.start || !b?.end) return false;

      const bookedStart = new Date(b.start);
      const bookedEnd = new Date(b.end);

      const slotStart = new Date(
        `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}T${slot.start}:00`
      );

      const slotEnd = new Date(
        `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}T${slot.end}:00`
      );

      return (
        bookedStart.getTime() === slotStart.getTime() &&
        bookedEnd.getTime() === slotEnd.getTime()
      );
    });
  };

  const isDayFullyBooked = () => {
    if (!selectedDate) return false;

    return SLOT_DATA.every(slot => isSlotBooked(slot));
  };

  const isToday =
    selectedDay === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();
  
  const shouldDisableDay = isToday && isDayFullyBooked();
  console.log(shouldDisableDay)

  const isCalendarDayFullyBooked = (day: number) => {
    const today = new Date();

    const isThatDayToday =
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear();

    return isThatDayToday && isDayFullyBooked();
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
                    disabled={isCalendarDayFullyBooked(day)}
                  type="button"
                  className={`day ${isCalendarDayFullyBooked(day) ? "fully-booked-day" : ""}
                    ${selectedDay === day ? "active" : ""}
                    ${selectedDay === day && isDayFullyBooked() ? "fully-booked-day" : ""}
                  `}
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
                  disabled={isSlotBooked(slot) || isDayFullyBooked()}
                  className={`slot
                    ${selectedTime?.start === slot.start ? "active" : ""}
                    ${isSlotBooked(slot) ? "booked" : ""}
                  `}
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
