
"use client";

import { useState, type ChangeEvent } from "react";
import * as XLSX from "xlsx";
import {
  Upload,
  Users,
  MessageSquare,
  Copy,
  CheckCircle,
  Trash2,
  ExternalLink,
} from "lucide-react";

export default function Home() {
  const [links, setLinks] = useState("");
  const [message, setMessage] = useState("");
  const [customers, setCustomers] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  // Instagram username ya profile URL validate karo
  function getUsername(value: string): string | null {
    const text = value.trim().replace(/^@/, "");

    if (!text) return null;

    const match = text.match(
      /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._]+)\/?(?:\?.*)?$/
    );

    const username = match ? match[1] : text;

    if (
      !/^[a-zA-Z0-9._]{1,30}$/.test(username) ||
      username.startsWith(".") ||
      username.endsWith(".") ||
      username.includes("..")
    ) {
      return null;
    }

    return username;
  }

  function addCustomers(values: string[]) {
    const valid = values
      .map(getUsername)
      .filter((x): x is string => x !== null);

    const unique = [
      ...new Map(
        [...customers, ...valid].map((user) => [
          user.toLowerCase(),
          user,
        ])
      ).values(),
    ];

    setCustomers(unique);

    setNotice(
      `${valid.length} valid entries processed. Total: ${unique.length}`
    );
  }

  async function uploadExcel(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
        header: 1,
        defval: "",
      });

      const values = rows
        .flat()
        .filter((x): x is string => typeof x === "string");

      addCustomers(values);
    } catch {
      setNotice("Excel file read nahi ho saki.");
    }

    e.target.value = "";
  }

  function removeCustomer(username: string) {
    setCustomers((prev) =>
      prev.filter((user) => user !== username)
    );
  }

  async function copyMessage() {
    if (!message.trim()) return;

    try {
      await navigator.clipboard.writeText(message);
      setNotice("Message copied successfully!");
    } catch {
      setNotice("Message copy nahi ho saka.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex items-center gap-4">
          <div className="bg-pink-600 p-3 rounded-2xl text-2xl">
            📸
          </div>

          <div>
            <h1 className="text-2xl md:text-4xl font-bold">
              Insta DM Manager
            </h1>

            <p className="text-slate-400 mt-1">
              Business Customer Dashboard
            </p>
          </div>
        </header>

        {/* Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <Users className="text-blue-400 mb-3" size={30} />

            <p className="text-slate-400">
              Total Customers
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {customers.length}
            </h2>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <MessageSquare
              className="text-pink-400 mb-3"
              size={30}
            />

            <p className="text-slate-400">
              Message Status
            </p>

            <h2 className="text-2xl font-bold mt-2">
              {message.trim() ? "Ready" : "Not Ready"}
            </h2>
          </div>

        </div>

        {/* Add Customers */}
        <section className="bg-slate-900 p-6 rounded-2xl space-y-5 border border-slate-800">

          <h2 className="text-xl font-bold">
            Add Instagram Customers
          </h2>

          <p className="text-sm text-slate-400">
            Paste one Instagram link per line, or upload
            an Excel / CSV file.
          </p>

          <textarea
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl outline-none focus:border-pink-500 resize-y"
            rows={5}
            placeholder={
              "https://instagram.com/customer1\n" +
              "https://instagram.com/customer2\n" +
              "@customer3"
            }
            value={links}
            onChange={(e) => setLinks(e.target.value)}
          />

          <button
            disabled={!links.trim()}
            onClick={() => {
              addCustomers(links.split(/[\n,]+/));
              setLinks("");
            }}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-3 rounded-xl font-semibold transition"
          >
            Add Customers
          </button>

          <label className="flex items-center justify-center gap-3 cursor-pointer bg-slate-800 hover:bg-slate-700 border border-dashed border-slate-600 p-5 rounded-xl transition">
            <Upload size={22} />
            <span>Upload Excel / CSV</span>

            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={uploadExcel}
            />
          </label>

        </section>

        {/* Message */}
        <section className="bg-slate-900 p-6 rounded-2xl space-y-5 border border-slate-800">

          <h2 className="text-xl font-bold">
            Your Business Message
          </h2>

          <textarea
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl outline-none focus:border-pink-500 resize-y"
            rows={5}
            placeholder="Hello! Welcome to our business..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <p className="text-sm text-slate-400">
            Characters: {message.length}
          </p>

          <button
            disabled={!message.trim()}
            onClick={copyMessage}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 px-6 py-3 rounded-xl font-semibold transition"
          >
            <Copy size={18} />
            Copy Message
          </button>

        </section>

        {/* Customer List */}
        <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

          <div className="flex items-center justify-between gap-3 mb-5">
            <h2 className="text-xl font-bold">
              Customer List
            </h2>

            <span className="bg-slate-800 px-3 py-1 rounded-full text-sm">
              {customers.length} Customers
            </span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">

            {customers.map((user) => (
              <div
                key={user.toLowerCase()}
                className="flex items-center justify-between gap-3 bg-slate-800 p-4 rounded-xl"
              >
                <span className="truncate font-medium">
                  @{user}
                </span>

                <div className="flex items-center gap-4 shrink-0">
                  <a
                    href={`https://www.instagram.com/${user}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-400 hover:text-pink-300"
                    title="Open Instagram profile"
                  >
                    <ExternalLink size={20} />
                  </a>

                  <button
                    onClick={() => removeCustomer(user)}
                    className="text-red-400 hover:text-red-300"
                    title="Remove customer"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            {customers.length === 0 && (
              <p className="text-slate-400 text-center py-8">
                No customers added yet.
              </p>
            )}

          </div>

        </section>

        {/* Notice */}
        {notice && (
          <div
            role="status"
            className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm"
          >
            {notice}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-slate-400 text-sm pb-5">
          <CheckCircle
            className="inline mr-2 text-green-400"
            size={17}
          />
          Dashboard ready. Automatic DMs require
          official Meta API integration and eligible
          customer conversations.
        </footer>

      </div>
    </main>
  );
}
