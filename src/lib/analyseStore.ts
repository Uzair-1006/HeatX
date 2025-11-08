import { create } from "zustand";
import axios from "axios";

interface AnalyzeState {
  dataset: string[][] | null;
  result: any | null;
  loading: boolean;
  error: string | null;
  setDataset: (data: string[][]) => void;
  clearDataset: () => void;
  analyzeDataset: (task: "regression" | "classification") => Promise<void>;
}

export const useAnalyzeStore = create<AnalyzeState>((set, get) => ({
  dataset: null,
  result: null,
  loading: false,
  error: null,

  setDataset: (data) => set({ dataset: data }),
  clearDataset: () => set({ dataset: null, result: null, error: null }),

  analyzeDataset: async (task) => {
    const { dataset } = get();
    if (!dataset) {
      set({ error: "No dataset available" });
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await axios.post("http://127.0.0.1:8000/analyze", {
        dataset,
        task,
      });
      set({ result: response.data });
    } catch (err: any) {
      set({ error: err?.response?.data?.detail || "Analysis failed" });
    } finally {
      set({ loading: false });
    }
  },
}));
