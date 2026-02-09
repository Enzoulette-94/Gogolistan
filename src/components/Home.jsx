import { Link } from "react-router-dom";
import Countdown from "./Countdown";

function formatName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

export default function Home({ people }) {
  return (
    <main className="home-page">
      <header className="home-navbar">
        <nav className="tabs-nav" aria-label="Navigation vers les profils">
          {people.map((person) => (
            <Link key={person} to={`/${person}`} className="tab-link">
              {formatName(person)}
            </Link>
          ))}
        </nav>
      </header>

      <h1 className="home-title">GOGOLISTAN</h1>
      <Countdown />
    </main>
  );
}
