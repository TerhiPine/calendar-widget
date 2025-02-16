import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, addMonths, subMonths } from "date-fns";
import { Moon, Hemisphere } from "lunarphase-js";
import './CalendarWidget.css'; // Polku CSS-tiedostoon

const CalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const calculateMoonPhase = (date) => {
    const emoji = Moon.lunarPhaseEmoji(date, { hemisphere: Hemisphere.NORTHERN });
    const phase = Moon.lunarPhase(date);
    const phaseName = phase.phaseName;

    return { name: phaseName, emoji: emoji };
  };

  const generateCalendar = () => {
    const startDate = startOfWeek(startOfMonth(currentDate));
    const endDate = endOfMonth(currentDate);
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(new Date(day));
      day = addDays(day, 1);
    }
    return days;
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const days = generateCalendar();

  return (
    <div className="calendar-widget">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>Edellinen</button>
        <h3 className="current-month">{format(currentDate, "MMMM yyyy")}</h3> {/* Muutettu muotoon MMMM yyyy */}
        <button onClick={handleNextMonth}>Seuraava</button>
      </div>

      <div className="calendar-grid">
        {["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"].map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        {days.map(day => {
          const phaseInfo = calculateMoonPhase(day);

          return (
            <div key={day} className="calendar-day">
              {format(day, "d")}
              <div className="moon-phase">
                <span>{phaseInfo.name}</span>
                <span>{phaseInfo.emoji}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarWidget;


