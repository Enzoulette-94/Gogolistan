import "./PRHistory.css";

function formatPRDate(dateValue) {
  if (!dateValue) {
    return "vide";
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default function PRHistory({ entries, personName }) {
  const groupedEntries = entries.reduce(
    (accumulator, entry) => {
      const category = entry?.item?.category || "poids";
      if (!accumulator[category]) {
        accumulator[category] = [];
      }
      accumulator[category].push(entry);
      return accumulator;
    },
    { musculation: [], course: [], poids: [] }
  );

  const orderedCategories = ["musculation", "course", "poids"];

  return (
    <div className="prHistoryByCategory">
      {orderedCategories.map((category) => {
        const categoryEntries = groupedEntries[category];
        if (!categoryEntries || categoryEntries.length === 0) {
          return null;
        }

        return (
          <section key={category} className="prHistoryCategorySection">
            <h3 className={`prHistoryCategoryTitle cat--${category}`}>{category}</h3>
            <ul className="prHistoryList">
              {categoryEntries.map((entry) => {
                const date = formatPRDate(entry?.item?.date);
                const note = entry?.item?.note || "";

                return (
                  <li key={entry.id} className="prHistoryItem">
                    <div className="prLine">
                      <p className="prDateLine">
                        {personName} · {date}
                      </p>
                      <p className="prNoteLine">{note}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
