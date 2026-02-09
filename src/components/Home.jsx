import { Link } from "react-router-dom";

export default function Home({ people }) {
  return (
    <main className="home-page">
      <h1 className="home-title">GOGOLISTAN</h1>

      <nav className="tabs-nav" aria-label="Navigation vers les profils">
        {people.map((person) => (
          <Link key={person} to={`/${person}`} className="tab-link">
            {person}
          </Link>
        ))}
      </nav>
    </main>
  );
}
