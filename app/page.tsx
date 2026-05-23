"use client";

import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left Column – Professor Zone */}
        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            Course Material
          </h2>

          <label className="mb-2 block text-sm font-medium text-gray-600">
            Select a syllabus PDF
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
          />

          <button
            disabled={!file}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Upload Syllabus
          </button>

          {file && (
            <p className="mt-3 text-sm text-gray-500">
              Selected: {file.name}
            </p>
          )}
        </section>

        {/* Right Column – Student Zone */}
        <section className="flex flex-col rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            Ask the Syllabus
          </h2>

          {/* Chat messages */}
          <div className="mb-4 flex-1 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4">
            {messages.length === 0 && (
              <p className="text-center text-sm text-gray-400">
                Upload a syllabus, then ask a question.
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-3 rounded-lg px-4 py-2 text-sm ${msg.role === "user"
                    ? "ml-auto max-w-[80%] bg-indigo-100 text-indigo-900"
                    : "mr-auto max-w-[80%] bg-gray-200 text-gray-800"
                  }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          {/* Input area */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700">
              Send
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
