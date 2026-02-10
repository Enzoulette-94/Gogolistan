import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import PersonPage from "./components/PersonPage";

const PROFILES = {
  thomas: {
    description:
      "Homme qui s'engage sur les 12 travaux d'Hercule avec un bébé, un concours, une femme, et un 35h. Capable de porter lourd, courir longtemps, avoir des abdos mais ne comprend pas le second degrés et incapable de mettre en vert des PR.",
    tasks: [
      "Passer 110 kilos au squat",
      "Faire 5 MU lestes a 10 kilos",
      "Soulever 170 kilos au deadlift (DL)",
    ],
  },
  yanice: {
    description:
      "Dz qui mange du quinoa avec de la sauce boulgour depuis debut janvier. Anomalie physique, monstrueux en crossfit, porte tres lourd mais pas capable de courir 150m ni de suivre une conversation sur WA. Chacun son combat.",
    tasks: [
      "Passer 10 MU",
      "Passer 10 ring MU",
      "Etre a 76 kilos",
      "Courir un 10 km en 49 min",
    ],
  },
  xavier: {
    description:
      "Grand bourguignon solide, assez complet dans l'ensemble, judoka depuis toujours. Petit problème de mental malgès la volonté de courir 21km avec un adducteur en moins pour ne pas faire la salope devant Thomas.",
    tasks: [
      "Passer 150 kilos au squat",
      "Pousser 150 kilos au DC",
      "Courir un 10 km en moins de 41 min",
      "Courir un semi-marathon en moins de 1 h 40",
      "Descendre sous les 86 kilos",
    ],
  },
  yannis: {
    description:
      "Homme le plus petit en taille mais le plus grand en message whatsapp d'entrainement. Super complet. T'envoie des exercices qui sont pas encore inventes. Capable de rester 6h a la salle mais pas capable de regarder la couleur rose plus de 7 secondes.",
    tasks: [
      "Etre a 67 kilos",
      "Passer 12 muscle up",
      "Pousser 100 kilos au DC",
      "Courir un semi-marathon (21 km) en 1 h 40",
    ],
  },
  enzo: {
    description:
      "Homme le plus fort et endurant du groupe, mange sainement, bon rythme de sommeil, equilibré parfait, un sans faute, ne valide pas les objectifs pour pas frustrer les copains. Un grand homme.",
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
      <Route
        path="/:name"
        element={<PersonPage profiles={PROFILES} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
