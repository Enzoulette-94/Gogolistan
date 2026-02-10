import { useEffect, useState } from "react";

// Fixed UTC+01:00 target (ignore DST shifts)
const TARGET_TIMESTAMP = Date.parse("2026-05-08T00:00:00+01:00");

function getRemainingTime(targetTimestamp) {
  const now = Date.now();
  const diff = targetTimestamp - now;

  if (diff <= 0) {
    return { finished: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return { finished: false, days, hours, minutes, seconds };
}

export default function Countdown() {
  // Fixed timezone target: 8 May 2026, 00:00:00 Europe/Paris
  const [timeLeft, setTimeLeft] = useState(() =>
    getRemainingTime(TARGET_TIMESTAMP)
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(getRemainingTime(TARGET_TIMESTAMP));
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
      {timeLeft.days} jours · {timeLeft.hours} heures · {timeLeft.minutes}{" "}
      minutes · {timeLeft.seconds} secondes
    </p>
  );
}
