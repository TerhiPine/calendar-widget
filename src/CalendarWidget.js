import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, addMonths, subMonths, isSameDay } from "date-fns";
import { Moon, Hemisphere } from "lunarphase-js";
import './CalendarWidget.css';

const CalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const moonPhaseTranslations = {
    "New": "Uusikuu",
    "Waxing Crescent": "Kasvava sirppi",
    "First Quarter": "Ensimmäinen neljännes",
    "Waxing Gibbous": "Kasvava kupera",
    "Full": "Täysikuu",
    "Waning Gibbous": "Vähenevä kupera",
    "Last Quarter": "Viimeinen neljännes",
    "Waning Crescent": "Vähenevä sirppi"
  };
  

  const calculateMoonPhase = (date) => {
    const emoji = Moon.lunarPhaseEmoji(date, { hemisphere: Hemisphere.NORTHERN });
    const phase = Moon.lunarPhase(date); // Tämä palauttaa suoraan kuun vaiheen nimen

    const phaseFinnish = moonPhaseTranslations[phase] || phase;

    console.log("Phase:", phase); // Tarkista mitä palautuu

    return { name: phaseFinnish, emoji: emoji };
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
        <h3 className="current-month">{format(currentDate, "dd MMMM yyyy")}</h3>
        <button onClick={handleNextMonth}>Seuraava</button>
      </div>

      <div className="calendar-grid">
        {["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"].map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        {days.map(day => {
          const phaseInfo = calculateMoonPhase(day);
          const isToday = isSameDay(day, new Date());

          return (
            <div key={day} className={`calendar-day ${isToday ? 'current-day' : ''}`}>
              {format(day, "d")}
              <div className="moon-phase">
                <span>{phaseInfo.name}</span> {/* Nyt näyttää oikean nimen */}
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



