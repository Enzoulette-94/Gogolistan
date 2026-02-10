import { useCallback, useEffect, useState } from "react";
import { apiClient } from "../lib/apiClient";

export function usePersonalRecords(slug) {
  const [records, setRecords] = useState([]);
  const [history, setHistory] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [recordsError, setRecordsError] = useState("");
  const [historyError, setHistoryError] = useState("");

  const fetchRecords = useCallback(async () => {
    if (!slug) {
      setRecords([]);
      setLoadingRecords(false);
      return;
    }

    setLoadingRecords(true);
    setRecordsError("");

    try {
      const data = await apiClient.get(`/people/${slug}/personal_records`);
      setRecords(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setRecordsError(requestError.message || "Erreur de chargement des PR");
    } finally {
      setLoadingRecords(false);
    }
  }, [slug]);

  const fetchHistory = useCallback(async () => {
    if (!slug) {
      setHistory([]);
      setLoadingHistory(false);
      return;
    }

    setLoadingHistory(true);
    setHistoryError("");

    try {
      const data = await apiClient.get(`/people/${slug}/personal_records/history`);
      setHistory(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setHistoryError(requestError.message || "Erreur de chargement de l'historique");
    } finally {
      setLoadingHistory(false);
    }
  }, [slug]);

  const createRecord = useCallback(
    async (payload, writePassword) => {
      const created = await apiClient.post(
        `/people/${slug}/personal_records`,
        payload,
        writePassword
      );
      setRecords((previous) => [created, ...previous]);
      await fetchHistory();
      return created;
    },
    [slug, fetchHistory]
  );

  const updateRecord = useCallback(
    async (recordId, payload, writePassword) => {
      const updated = await apiClient.patch(
        `/personal_records/${recordId}`,
        payload,
        writePassword
      );
      setRecords((previous) =>
        previous.map((record) => (record.id === recordId ? updated : record))
      );
      await fetchHistory();
      return updated;
    },
    [fetchHistory]
  );

  const deleteRecord = useCallback(
    async (recordId, writePassword) => {
      await apiClient.delete(`/personal_records/${recordId}`, writePassword);
      setRecords((previous) => previous.filter((record) => record.id !== recordId));
      await fetchHistory();
    },
    [fetchHistory]
  );

  useEffect(() => {
    fetchRecords();
    fetchHistory();
  }, [fetchRecords, fetchHistory]);

  return {
    records,
    history,
    loadingRecords,
    loadingHistory,
    recordsError,
    historyError,
    fetchRecords,
    fetchHistory,
    createRecord,
    updateRecord,
    deleteRecord,
  };
}
