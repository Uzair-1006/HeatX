"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const API_BASE = "http://localhost:8000"; // your FastAPI backend

export default function CCTSDashboard() {
  const [orgs, setOrgs] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("mint");
  const [form, setForm] = useState({
    org_id: "",
    to_org: "",
    amount: 100,
    reason: "",
    metadata: "",
  });
  const [response, setResponse] = useState(null);

  useEffect(() => {
    fetchOrgs();
    fetchLedger();
  }, []);

  const fetchOrgs = async () => {
    const res = await axios.get(`${API_BASE}/ccts/orgs`);
    setOrgs(res.data);
  };

  const fetchLedger = async () => {
    const res = await axios.get(`${API_BASE}/ccts/ledger`);
    setLedger(res.data.blocks || []);
  };

  const handleAction = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const payload =
        action === "mint"
          ? {
              org_id: form.org_id,
              amount: parseFloat(form.amount),
              metadata: { source: "frontend-dashboard" },
            }
          : action === "transfer"
          ? {
              from_org: form.org_id,
              to_org: form.to_org,
              amount: parseFloat(form.amount),
              metadata: { purpose: "frontend test transfer" },
            }
          : {
              org_id: form.org_id,
              amount: parseFloat(form.amount),
              reason: form.reason,
              metadata: { info: "frontend retire request" },
            };

      // 🔐 Get Signature
      const signRes = await axios.post(`${API_BASE}/sign`, {
        org_id: form.org_id,
        payload,
      });
      const signature = signRes.data.signature;

      // 🚀 Perform Action
      const route =
        action === "mint"
          ? "/ccts/mint"
          : action === "transfer"
          ? "/ccts/transfer"
          : "/ccts/retire";

      const res = await axios.post(`${API_BASE}${route}`, payload, {
        headers: { "X-Signature": signature },
      });
      setResponse(res.data);
      fetchLedger();
    } catch (err: any) {
      setResponse(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
        ♻️ HeatX | Carbon Credit Trading System
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ACTION PANEL */}
        <Card className="p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Perform Action
          </h2>
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm text-gray-600">Action</span>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="mt-1 w-full border p-2 rounded"
              >
                <option value="mint">Mint</option>
                <option value="transfer">Transfer</option>
                <option value="retire">Retire</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">Organization</span>
              <select
                value={form.org_id}
                onChange={(e) => setForm({ ...form, org_id: e.target.value })}
                className="mt-1 w-full border p-2 rounded"
              >
                <option value="">Select Org</option>
                {orgs.map((o) => (
                  <option key={o.org_id} value={o.org_id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </label>

            {action === "transfer" && (
              <label className="block">
                <span className="text-sm text-gray-600">To Organization</span>
                <select
                  value={form.to_org}
                  onChange={(e) =>
                    setForm({ ...form, to_org: e.target.value })
                  }
                  className="mt-1 w-full border p-2 rounded"
                >
                  <option value="">Select Receiver</option>
                  {orgs.map((o) => (
                    <option key={o.org_id} value={o.org_id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {action === "retire" && (
              <label className="block">
                <span className="text-sm text-gray-600">Reason</span>
                <input
                  type="text"
                  value={form.reason}
                  onChange={(e) =>
                    setForm({ ...form, reason: e.target.value })
                  }
                  className="mt-1 w-full border p-2 rounded"
                  placeholder="Reason for retiring credits"
                />
              </label>
            )}

            <label className="block">
              <span className="text-sm text-gray-600">Amount</span>
              <input
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
                className="mt-1 w-full border p-2 rounded"
              />
            </label>

            <Button
              onClick={handleAction}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" /> Processing...
                </>
              ) : (
                "Execute"
              )}
            </Button>
          </div>

          {response && (
            <div className="mt-4 bg-gray-100 p-3 rounded text-sm font-mono">
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}
        </Card>

        {/* LEDGER PANEL */}
        <Card className="p-6 shadow-md overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Blockchain Ledger
          </h2>
          <div className="space-y-3 max-h-[70vh] overflow-y-scroll">
            {ledger.map((block) => (
              <motion.div
                key={block.index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 border rounded bg-white"
              >
                <p className="text-sm text-gray-500">Block #{block.index}</p>
                {block.txs.map((tx) => (
                  <div key={tx.tx_id} className="mt-2 text-sm">
                    <p>
                      <b>Type:</b> {tx.type}
                    </p>
                    <p>
                      <b>Tx ID:</b> {tx.tx_id}
                    </p>
                    <p>
                      <b>Org:</b>{" "}
                      {tx.payload?.org_id ||
                        tx.payload?.from_org ||
                        "N/A"}
                    </p>
                    <p>
                      <b>Amount:</b>{" "}
                      {tx.payload?.amount || "—"}
                    </p>
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
