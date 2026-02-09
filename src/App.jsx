import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import PersonPage from "./components/PersonPage";

const PROFILES = {
  thomas: {
    description: "Objectifs de Thomas en musculation.",
    tasks: [
      "Passer 110 kilos au squat",
      "Faire 5 MU lestes a 10 kilos",
      "Soulever 170 kilos au deadlift (DL)",
    ],
  },
  yanice: {
    description: "Objectifs de Yanice en musculation, course et poids.",
    tasks: [
      "Passer 10 MU",
      "Passer 10 ring MU",
      "Etre a 76 kilos",
      "Courir un 10 km en 49 min",
    ],
  },
  xavier: {
    description: "Objectifs de Xavier en musculation, course et poids.",
    tasks: [
      "Passer 150 kilos au squat",
      "Pousser 150 kilos au DC",
      "Courir un 10 km en moins de 41 min",
      "Courir un semi-marathon en moins de 1 h 40",
      "Descendre sous les 86 kilos",
    ],
  },
  yannis: {
    description: "Objectifs de Yannis en musculation, course et poids.",
    tasks: [
      "Etre a 67 kilos",
      "Passer 12 muscle up",
      "Pousser 100 kilos au DC",
      "Courir un semi-marathon (21 km) en 1 h 40",
    ],
  },
  enzo: {
    description: "Objectifs de Enzo en course, musculation et poids.",
    tasks: [
      "Courir 10 km en moins de 55 min",
      "Courir 21 km en moins de 2 h",
      "Passer 5 MU",
      "Pousser 100 kilos au DC",
      "Soulever 140 kilos au deadlift (DL)",
      "Soulever 100 kilos au squat",
      "Descendre sous les 79 kilos",
    ],
  },
};

const PEOPLE = Object.keys(PROFILES);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home people={PEOPLE} />} />
      <Route path="/:name" element={<PersonPage profiles={PROFILES} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
