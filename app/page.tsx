
"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import {
  Instagram,
  Upload,
  Users,
  MessageSquare,
  Copy,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  const [links, setLinks] = useState("");
  const [message, setMessage] = useState("");
  const [customers, setCustomers] = useState<string[]>([]);

  function getUsername(value: string) {
    const text = value.trim().replace(/^@/, "");
    const match = text.match(
      /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._]+)\/?(?:\?.*)?$/
    );
    const username = match ? match[1] : text;

    return /^[a-zA-Z0-9._]{1,30}$/.test(username)
      ? username
      : null;
  }

  function addCustomers(values: string[]) {
    const valid = values
      .map(getUsername)
      .filter((x): x is string => x !== null);

    setCustomers((prev) => [...new Set([...prev, ...valid])]);
  }

  async function uploadExcel(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json<string[]>(sheet, {
      header: 1,
    });

    const values = rows
      .flat()
      .filter((x): x is string => typeof x === "string");

    addCustomers(values);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center gap-3">
          <Instagram className="text-pink-500" size={36} />
          <div>
            <h1 className="text-3xl font-bold">
              Insta DM Manager
            </h1>
            <p className="text-slate-400">
              Business Customer Dashboard
            </p>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900 rounded-xl p-5">
            <Users className="text-blue-400 mb-2" />
            <p className="text-slate-400">Customers</p>
            <h2 className="text-3xl font-bold">
              {customers.length}
            </h2>
          </div>

          <div className="bg-slate-900 rounded-xl p-5">
            <MessageSquare className="text-pink-400 mb-2" />
            <p className="text-slate-400">Message Ready</p>
            <h2 className="text-3xl font-bold">
              {message.trim() ? "Yes" : "No"}
            </h2>
          </div>
        </div>

        <section className="bg-slate-900 p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-semibold">
            Add Instagram Customers
          </h2>

          <textarea
            className="w-full p-4 bg-slate-800 rounded-xl outline-none"
            rows={5}
            placeholder="Paste Instagram links, one per line..."
            value={links}
            onChange={(e) => setLinks(e.target.value)}
          />

          <button
            onClick={() => {
              addCustomers(links.split(/[\n,]+/));
              setLinks("");
            }}
            className="bg-blue-600 px-5 py-3 rounded-xl"
          >
            Add Customers
          </button>

          <label className="flex items-center gap-3 cursor-pointer bg-slate-800 p-4 rounded-xl">
            <Upload size={20} />
            Upload Excel / CSV
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={uploadExcel}
            />
          </label>
        </section>

        <section className="bg-slate-900 p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-semibold">
            Your Business Message
          </h2>

          <textarea
            className="w-full p-4 bg-slate-800 rounded-xl outline-none"
            rows={5}
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            disabled={!message.trim()}
            onClick={() => navigator.clipboard.writeText(message)}
            className="flex items-center gap-2 bg-pink-600 disabled:opacity-50 px-5 py-3 rounded-xl"
          >
            <Copy size={18} />
            Copy Message
          </button>
        </section>

        <section className="bg-slate-900 p-6 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">
            Customer List
          </h2>

          <div className="space-y-3">
            {customers.map((user) => (
              <div
                key={user}
                className="flex justify-between items-center gap-3 bg-slate-800 p-3 rounded-lg"
              >
                <span className="truncate">@{user}</span>
                <a
                  href={`https://www.instagram.com/${user}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 shrink-0"
                >
                  Open Profile
                </a>
              </div>
            ))}
          </div>

          {customers.length === 0 && (
            <p className="text-slate-400">
              No customers added yet.
            </p>
          )}
        </section>

        <p className="text-center text-slate-400 text-sm">
          <CheckCircle className="inline mr-2" size={16} />
          Dashboard ready. Automatic sending requires
          official Meta API integration and eligible conversations.
        </p>
      </div>
    </main>
  );
}
