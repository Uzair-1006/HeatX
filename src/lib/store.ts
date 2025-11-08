import { create } from "zustand";
import axios from "axios";

// Store to hold uploaded dataset
interface DatasetState {
  dataset: string[][] | null;
  name: string | null;
  setDataset: (name: string, data: string[][]) => void;
  clearDataset: () => void;
}

export const useDatasetStore = create<DatasetState>((set) => ({
  dataset: null,
  name: null,
  setDataset: (name, data) => set({ name, dataset: data }),
  clearDataset: () => set({ name: null, dataset: null }),
}));

// Store for analysis logic
interface AnalyzeState {
  result: any | null;
  loading: boolean;
  error: string | null;
  analyzeDataset: (task: "regression" | "classification") => Promise<void>;
  clearResult: () => void;
}

export const useAnalyzeStore = create<AnalyzeState>((set) => ({
  result: null,
  loading: false,
  error: null,

  clearResult: () => set({ result: null, error: null }),

  analyzeDataset: async (task) => {
    const dataset = useDatasetStore.getState().dataset;
    if (!dataset) {
      set({ error: "No dataset available" });
      return;
    }

    set({ loading: true, error: null, result: null });

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
