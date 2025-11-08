"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UploadCloud, FileSpreadsheet, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAnalyzeStore } from "@/lib/analyseStore"; // single store

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const setDataset = useAnalyzeStore((state) => state.setDataset); // store for full dataset

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview([]);
    setError(null);
  };

  // Handle drag & drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setPreview([]);
      setError(null);
    }
  };

  // Upload file to backend
  const uploadFile = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const backendURL = "http://127.0.0.1:8000/api/upload";

      const response = await axios.post(backendURL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Set preview (first few rows) for UI
      if (response.data?.preview) setPreview(response.data.preview);

      // Set full dataset in store for analyze page
      if (response.data?.dataset) setDataset(response.data.dataset);
      
      if (!response.data?.preview && !response.data?.dataset) {
        setError("No data returned from server.");
      }
    } catch (err: any) {
      console.error("Upload Error:", err);
      setError(err?.response?.data?.error || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Upload Section */}
      <Card className="glass-panel border-white/10 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5" />
            Upload Industrial Dataset
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-orange-400 transition-colors cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <FileSpreadsheet className="h-12 w-12 mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400 mb-2 font-medium">Drag & drop your CSV or Excel file</p>
            <p className="text-xs text-gray-500 mb-4">or click to browse</p>
            <Button variant="outline">Select File</Button>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {file && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-green-400">{file.name}</div>
                  <div className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</div>
                </div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </motion.div>
          )}

          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}

          <div className="mt-6 flex gap-2">
            <Button
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:scale-105 transition-transform"
              onClick={uploadFile}
              disabled={!file || loading}
            >
              {loading ? "Uploading..." : "Upload & Preview"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <AnimatePresence>
        {preview.length > 0 && (
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}>
            <Card className="glass-panel border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  Data Preview (First 5 Rows)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-3">
                  Here’s a quick look at the uploaded dataset. Verify that the columns and rows look correct.
                </p>
                <div className="overflow-auto max-h-96 border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {preview[0]?.map((header, i) => (
                          <TableHead key={i} className="whitespace-nowrap">
                            {header || `Col ${i + 1}`}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preview.slice(1).map((row, i) => (
                        <TableRow key={i} className="hover:bg-white/5">
                          {row.map((cell, j) => (
                            <TableCell key={j} className="whitespace-nowrap">{cell || "-"}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Proceed Button */}
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => router.push("/dashboard/analyze")}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    Proceed to Analysis <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
