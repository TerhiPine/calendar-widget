import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, addMonths, subMonths, isSameDay } from "date-fns";
import { Moon, Hemisphere } from "lunarphase-js";
import './CalendarWidget.css';

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

const moonPhaseBeliefs = {
  "Uusikuu": "Uudella kuulla kylvetään ja istutetaan ylöspäin satoa kasvattavat kasvit ja se on myös hyvää aikaa vaihtaa huonekasvien mullat",
  "Kasvava sirppi": "Paras kylvöaika on kuun kasvaessa, jolloin siemenet itävät nopeammin. Sopiva ajankohta on aamupäivä, jolloin vielä etelä- tai lounaistuulet puhaltelevat.",
  "Ensimmäinen neljännes": "Hyvä aika tehdä päätöksiä ja ottaa konkreettisia askelia kohti tavoitteita.",
  "Kasvava kupera": "istutetaan satoa maan alle tai tyveen (keräsalaatti, kaali, sipulit, tilli) tekevät kasvit. Alakuun aikaan muokataan ja lannoitetaan myös maa ja sen viimeiset päivät ovat parasta aikaa kitkeä rikkaruohot",
  "Täysikuu": "Täydenkuun aika on lepoaikaa, silloin ei tehdä mitään, paitsi rentoudutaan",
  "Vähenevä kupera": "Joskus pitää hävittää tuholaisia vähenevän kuun aikaan, joskus riittää että lisää lannoitetta. ",
  "Viimeinen neljännes": "Päätösten ja arvioinnin aika. Sopii menneiden asioiden käsittelyyn ja loppuunsaattamiseen.",
  "Vähenevä sirppi": "Sisäänpäin kääntymisen ja rauhoittumisen aika. Meditaatio ja lepo ovat tärkeitä."
};

const calculateMoonPhase = (date) => {
    const emoji = Moon.lunarPhaseEmoji(date, { hemisphere: Hemisphere.NORTHERN });
    const phase = Moon.lunarPhase(date);
    const phaseFinnish = moonPhaseTranslations[phase] || phase;
    return { name: phaseFinnish, emoji: emoji };
};

const getMoonBeliefForDate = (date) => {
    const phaseInfo = calculateMoonPhase(date);
    return moonPhaseBeliefs[phaseInfo.name] || "Ei saatavilla tietoa tälle kuun vaiheelle.";
};

const CalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date()); // Valittu päivä

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

  const handleDayClick = (day) => {
    setSelectedDate(day);
  };

  const days = generateCalendar();
  const selectedPhase = calculateMoonPhase(selectedDate);
  const selectedBelief = getMoonBeliefForDate(selectedDate);

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
          const isSelected = isSameDay(day, selectedDate); // Onko päivä valittu

          return (
            <div 
              key={day} 
              className={`calendar-day ${isToday ? 'current-day' : ''} ${isSelected ? 'selected-day' : ''}`} 
              onClick={() => handleDayClick(day)} // Klikattava päivä
            >
              {format(day, "d")}
              <div className="moon-phase">
                <span>{phaseInfo.name}</span>
                <span>{phaseInfo.emoji}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Näytetään valitun päivän kuun vaihe ja uskomukset */}
      <div className="moon-beliefs">
        <h3>Valitun päivän kuun vaihe</h3>
        <p><strong>{selectedPhase.name} {selectedPhase.emoji}</strong></p>
        <p>{selectedBelief}</p>
      </div>
    </div>
  );
};

export default CalendarWidget;





