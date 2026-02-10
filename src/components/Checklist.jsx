import "./Checklist.css";

export default function Checklist({ items, onToggle, idPrefix = "checklist" }) {
  const total = items.length;
  const doneCount = items.filter((item) => item.done).length;
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  return (
    <section className="checklistSection" aria-label="Checklist de validation">
      <div className="progressRow">
        <span>
          {doneCount}/{total} valides
        </span>
        <span>{percent}%</span>
      </div>

      <div className="progressBar" aria-hidden="true">
        <div className="progressFill" style={{ width: `${percent}%` }} />
      </div>

      <ul className="profileChecklist">
        {items.map((item) => {
          const inputId = `${idPrefix}-${item.id}`;
          return (
            <li key={item.id}>
              <label
                htmlFor={inputId}
                className={`checkItem ${item.done ? "done" : ""}`}
              >
                <input
                  id={inputId}
                  type="checkbox"
                  checked={item.done}
                  onChange={() => onToggle(item.id)}
                />
                <span>{item.text}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
