import { useEffect, useState } from "react";

const TARGET_DATE = new Date(2026, 4, 8, 0, 0, 0);

function getRemainingTime(targetDate) {
  const now = Date.now();
  const diff = targetDate.getTime() - now;

  if (diff <= 0) {
    return { finished: true, days: 0, hours: 0, seconds: 0 };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const seconds = totalSeconds % 60;

  return { finished: false, days, hours, seconds };
}

export default function Countdown() {
  // Local browser timezone: 8 May 2026, 00:00:00
  const [timeLeft, setTimeLeft] = useState(() => getRemainingTime(TARGET_DATE));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(getRemainingTime(TARGET_DATE));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (timeLeft.finished) {
    return <p className="countdown">Temps ecoule</p>;
  }

  return (
    <p className="countdown">
      <span className="countdown-label">Temps restant :</span>
      <br />
      {timeLeft.days} jours · {timeLeft.hours} heures · {timeLeft.seconds}{" "}
      secondes
    </p>
  );
}
