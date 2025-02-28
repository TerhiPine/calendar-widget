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
  "Uusikuu": "Uudella kuulla kylvetään ja istutetaan ylöspäin satoa kasvattavat kasvit.",
  "Kasvava sirppi": "Paras kylvöaika on kuun kasvaessa, jolloin siemenet itävät nopeammin.",
  "Ensimmäinen neljännes": "Hyvä aika tehdä päätöksiä ja aloittaa uusia asioita.",
  "Kasvava kupera": "Istutetaan satoa maan alle kasvavat kasvit, kuten perunat ja sipulit.",
  "Täysikuu": "Täydenkuun aika on lepoaikaa, jolloin ei kannata tehdä suuria päätöksiä.",
  "Vähenevä kupera": "Hyvä aika kitkeä rikkaruohot ja poistaa tuholaiset.",
  "Viimeinen neljännes": "Päätösten ja arvioinnin aika, sopii menneiden asioiden käsittelyyn.",
  "Vähenevä sirppi": "Sisäänpäin kääntymisen ja rauhoittumisen aika. Meditaatio on tärkeää."
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openSection, setOpenSection] = useState(null); // Hallitsee avoimia linkkiosioita

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

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
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
          const isSelected = isSameDay(day, selectedDate);

          return (
            <div 
              key={day} 
              className={`calendar-day ${isToday ? 'current-day' : ''} ${isSelected ? 'selected-day' : ''}`} 
              onClick={() => handleDayClick(day)}
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

      <div className="moon-beliefs">
        <h3>Valitun päivän kuun vaihe</h3>
        <p><strong>{selectedPhase.name} {selectedPhase.emoji}</strong></p>
        <p>{selectedBelief}</p>
      </div>

      <div className="calendar-links">
        <button className="calendar-link" onClick={() => toggleSection("kylvokalenteri")}>
          Kylvökalenteri
        </button>
        <button className="calendar-link" onClick={() => toggleSection("kuunVaiheet")}>
          Kuun vaiheet
        </button>
        <button className="calendar-link" onClick={() => toggleSection("uskomukset")}>
          Uskomukset
        </button>
      </div>

      {openSection && (
        <div className="list-container open">
          {openSection === "kylvokalenteri" && <p>🌱 Kylvökalenterin ohjeet ja suositukset kuun vaiheiden mukaan.</p>}
          {openSection === "kuunVaiheet" && <p>🌕 Kuun vaiheet ja niiden vaikutukset eri toimintoihin.</p>}
          {openSection === "uskomukset" && <p>🔮 Perinteiset uskomukset eri kuun vaiheista.</p>}
        </div>
      )}
    </div>
  );
};

export default CalendarWidget;








