import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function formatName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

export default function PersonPage({ profiles }) {
  const { name = "" } = useParams();
  const normalizedName = name.toLowerCase();
  const profile = profiles[normalizedName];
  const exists = Boolean(profile);
  const tasks = exists ? profile.tasks : [];

  const [checkedItems, setCheckedItems] = useState(() => tasks.map(() => false));

  useEffect(() => {
    setCheckedItems(tasks.map(() => false));
  }, [tasks]);

  const handleToggle = (index) => {
    setCheckedItems((previous) =>
      previous.map((item, itemIndex) => (itemIndex === index ? !item : item))
    );
  };

  return (
    <main className="person-page">
      <Link to="/" className="back-link">
        Retour a l'accueil
      </Link>

      <h1>{exists ? formatName(normalizedName) : "Profil introuvable"}</h1>
      <p>
        {exists
          ? profile.description
          : "Cette page n'existe pas dans la liste des prenoms."}
      </p>

      {exists && (
        <section>
          <h2>Choses a valider</h2>
          <ul className="checklist">
            {tasks.map((task, index) => (
              <li key={task}>
                <label>
                  <input
                    type="checkbox"
                    checked={checkedItems[index]}
                    onChange={() => handleToggle(index)}
                  />
                  <span>{task}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
