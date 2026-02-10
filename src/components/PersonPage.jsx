import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { usePersonalRecords } from "../hooks/usePersonalRecords";
import { apiClient } from "../lib/apiClient";
import Checklist from "./Checklist";
import PRHistory from "./PRHistory";

function formatName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function formatDate(value) {
  if (!value) {
    return "--/--/----";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function buildDefaultChecklistItems(tasks) {
  return tasks.map((text, index) => ({
    id: String(index),
    text,
    done: false,
  }));
}

function mapApiError(error, fallback) {
  if (error?.status === 401) {
    return "Mot de passe incorrect.";
  }
  if (error?.status === 422) {
    const details = error.details?.join(", ");
    return details || "Donnees invalides (date et note obligatoires).";
  }
  return error?.message || fallback;
}

export default function PersonPage({ profiles }) {
  const { name = "" } = useParams();
  const normalizedName = name.toLowerCase();
  const profile = profiles[normalizedName];
  const exists = Boolean(profile);
  const tasks = exists ? profile.tasks : [];

  const [activeTab, setActiveTab] = useState("infos");
  const [checklistItems, setChecklistItems] = useState(() =>
    buildDefaultChecklistItems(tasks)
  );
  const [checklistLoading, setChecklistLoading] = useState(true);
  const [checklistError, setChecklistError] = useState("");

  const [newDate, setNewDate] = useState("");
  const [newNote, setNewNote] = useState("");
  const [newCategory, setNewCategory] = useState("poids");
  const [writePassword, setWritePassword] = useState("");

  const [editingRecordId, setEditingRecordId] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editCategory, setEditCategory] = useState("poids");
  const [editPassword, setEditPassword] = useState("");

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const {
    records,
    history,
    loadingRecords,
    loadingHistory,
    recordsError,
    historyError,
    createRecord,
    updateRecord,
    deleteRecord,
  } = usePersonalRecords(exists ? normalizedName : "");

  useEffect(() => {
    if (!exists) {
      setChecklistItems([]);
      setChecklistLoading(false);
      return;
    }

    let ignore = false;
    const defaultItems = buildDefaultChecklistItems(tasks);

    async function fetchChecklist() {
      setChecklistLoading(true);
      setChecklistError("");

      try {
        const response = await apiClient.get(`/people/${normalizedName}/checklist`);
        if (ignore) return;
        const serverItems = Array.isArray(response?.items) ? response.items : [];

        if (serverItems.length === 0) {
          setChecklistItems(defaultItems);
          await apiClient.patch(`/people/${normalizedName}/checklist`, {
            items: defaultItems,
          });
        } else {
          const mergedItems = defaultItems.map((item) => {
            const match = serverItems.find(
              (serverItem) =>
                String(serverItem.id) === item.id || serverItem.text === item.text
            );
            return match ? { ...item, done: Boolean(match.done) } : item;
          });
          setChecklistItems(mergedItems);
        }
      } catch {
        setChecklistItems(defaultItems);
        setChecklistError("Impossible de charger la checklist depuis le serveur.");
      } finally {
        if (!ignore) {
          setChecklistLoading(false);
        }
      }
    }

    fetchChecklist();

    return () => {
      ignore = true;
    };
  }, [exists, normalizedName, tasks]);

  const handleToggle = async (itemId) => {
    const previousItems = checklistItems;
    const nextItems = checklistItems.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );

    setChecklistItems(nextItems);
    setChecklistError("");

    try {
      await apiClient.patch(`/people/${normalizedName}/checklist`, { items: nextItems });
    } catch {
      setChecklistItems(previousItems);
      setChecklistError("Impossible d'enregistrer la checklist.");
    }
  };

  const resetCreateForm = () => {
    setNewDate("");
    setNewNote("");
    setNewCategory("poids");
    setWritePassword("");
  };

  const cancelEdit = () => {
    setEditingRecordId(null);
    setEditDate("");
    setEditNote("");
    setEditCategory("poids");
    setEditPassword("");
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!newDate || !newNote.trim()) {
      setFormError("Date et note sont obligatoires.");
      return;
    }

    if (!writePassword.trim()) {
      setFormError("Le mot de passe est obligatoire.");
      return;
    }

    try {
      await createRecord(
        { date: newDate, note: newNote.trim(), category: newCategory },
        writePassword.trim()
      );
      resetCreateForm();
      setFormSuccess("PR ajoute.");
    } catch (error) {
      setFormError(mapApiError(error, "Erreur lors de l'ajout du PR."));
    }
  };

  const startEdit = (record) => {
    setEditingRecordId(record.id);
    setEditDate(record.date || "");
    setEditNote(record.note || "");
    setEditCategory(record.category || "poids");
    setEditPassword("");
    setFormError("");
    setFormSuccess("");
  };

  const handleSaveEdit = async (recordId) => {
    setFormError("");
    setFormSuccess("");

    if (!editDate || !editNote.trim()) {
      setFormError("Date et note sont obligatoires.");
      return;
    }

    if (!editPassword.trim()) {
      setFormError("Le mot de passe est obligatoire pour modifier.");
      return;
    }

    try {
      await updateRecord(
        recordId,
        { date: editDate, note: editNote.trim(), category: editCategory },
        editPassword.trim()
      );
      cancelEdit();
      setFormSuccess("PR modifie.");
    } catch (error) {
      setFormError(mapApiError(error, "Erreur lors de la modification du PR."));
    }
  };

  const handleDelete = async (recordId) => {
    setFormError("");
    setFormSuccess("");

    const password = window.prompt("Mot de passe pour supprimer ce PR :");
    if (!password || !password.trim()) {
      return;
    }

    try {
      await deleteRecord(recordId, password.trim());
      if (editingRecordId === recordId) {
        cancelEdit();
      }
      setFormSuccess("PR supprime.");
    } catch (error) {
      setFormError(mapApiError(error, "Erreur lors de la suppression du PR."));
    }
  };

  return (
    <main className="person-page">
      <Link to="/" className="back-link">
        Retour a l'accueil
      </Link>

      <h1>{exists ? formatName(normalizedName) : "Profil introuvable"}</h1>
      {!exists && <p>Cette page n'existe pas dans la liste des prenoms.</p>}

      {exists && (
        <>
          <div className="person-tabs">
            <button
              type="button"
              className={activeTab === "infos" ? "active" : ""}
              onClick={() => setActiveTab("infos")}
            >
              Infos
            </button>
            <button
              type="button"
              className={activeTab === "records" ? "active" : ""}
              onClick={() => setActiveTab("records")}
            >
              Personal Record Officiel
            </button>
            <button
              type="button"
              className={activeTab === "history" ? "active" : ""}
              onClick={() => setActiveTab("history")}
            >
              Historique
            </button>
          </div>

          {activeTab === "infos" && (
            <section>
              <h2>Description :</h2>
              <p>{profile.description}</p>
              <h2>Choses a valider</h2>
              {checklistLoading && <p>Chargement checklist...</p>}
              {checklistError && <p className="form-error">{checklistError}</p>}
              <Checklist
                items={checklistItems}
                onToggle={handleToggle}
                idPrefix={`check-${normalizedName}`}
              />
            </section>
          )}

          {activeTab === "records" && (
            <section className="records-section">
              <p>Lecture libre. Mot de passe requis pour ecrire.</p>

              <form className="record-form" onSubmit={handleCreate}>
                <h2>Ajouter Personal Record</h2>
                <label>
                  Date
                  <input
                    type="date"
                    value={newDate}
                    onChange={(event) => setNewDate(event.target.value)}
                    required
                  />
                </label>
                <label>
                  Note
                  <textarea
                    value={newNote}
                    onChange={(event) => setNewNote(event.target.value)}
                    required
                  />
                </label>
                <label>
                  Categorie
                  <select
                    value={newCategory}
                    onChange={(event) => setNewCategory(event.target.value)}
                    required
                  >
                    <option value="musculation">musculation</option>
                    <option value="course">course</option>
                    <option value="poids">poids</option>
                  </select>
                </label>
                <label>
                  Mot de passe
                  <input
                    type="password"
                    value={writePassword}
                    onChange={(event) => setWritePassword(event.target.value)}
                    required
                  />
                </label>
                <button type="submit">Ajouter PR</button>
              </form>

              {formError && <p className="form-error">{formError}</p>}
              {formSuccess && <p className="form-success">{formSuccess}</p>}
              {recordsError && <p className="form-error">{recordsError}</p>}

              <div className="records-current-block">
                <h2 className="records-current-title">
                  PR actuels de {formatName(normalizedName)}
                </h2>
                {loadingRecords && <p>Chargement...</p>}
                {!loadingRecords && records.length === 0 && (
                  <p>Aucun PR pour le moment.</p>
                )}

                {!loadingRecords && records.length > 0 && (
                  <ul className="records-list">
                    {records.map((record) => {
                      const isEditing = editingRecordId === record.id;

                      return (
                        <li key={record.id}>
                          {isEditing ? (
                            <div className="record-edit-inline">
                              <label>
                                Date
                                <input
                                  type="date"
                                  value={editDate}
                                  onChange={(event) => setEditDate(event.target.value)}
                                  required
                                />
                              </label>
                              <label>
                                Note
                                <textarea
                                  value={editNote}
                                  onChange={(event) => setEditNote(event.target.value)}
                                  required
                                />
                              </label>
                              <label>
                                Categorie
                                <select
                                  value={editCategory}
                                  onChange={(event) => setEditCategory(event.target.value)}
                                  required
                                >
                                  <option value="musculation">musculation</option>
                                  <option value="course">course</option>
                                  <option value="poids">poids</option>
                                </select>
                              </label>
                              <label>
                                Mot de passe
                                <input
                                  type="password"
                                  value={editPassword}
                                  onChange={(event) => setEditPassword(event.target.value)}
                                  required
                                />
                              </label>
                              <div className="record-actions">
                                <button type="button" onClick={() => handleSaveEdit(record.id)}>
                                  Enregistrer
                                </button>
                                <button type="button" onClick={cancelEdit}>
                                  Annuler
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="prLine">
                                <p className="prDateLine">
                                  {formatName(normalizedName)} · {formatDate(record.date)} ·{" "}
                                  <span
                                    className={`prCategory cat--${
                                      record.category || "poids"
                                    }`}
                                  >
                                    {record.category || "poids"}
                                  </span>
                                </p>
                                <p className="prNoteLine">{record.note}</p>
                              </div>
                              {(record.can_edit || record.can_delete) && (
                                <div className="record-actions">
                                  {record.can_edit && (
                                    <button type="button" onClick={() => startEdit(record)}>
                                      Modifier
                                    </button>
                                  )}
                                  {record.can_delete && (
                                    <button type="button" onClick={() => handleDelete(record.id)}>
                                      Supprimer
                                    </button>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </section>
          )}

          {activeTab === "history" && (
            <section className="history-section">
              <h2>Historique des PR</h2>
              {historyError && <p className="form-error">{historyError}</p>}
              {loadingHistory && <p>Chargement...</p>}
              {!loadingHistory && history.length === 0 && (
                <p>Aucune version pour le moment.</p>
              )}
              {!loadingHistory && history.length > 0 && (
                <PRHistory
                  entries={history}
                  personName={formatName(normalizedName)}
                />
              )}
            </section>
          )}
        </>
      )}
    </main>
  );
}
