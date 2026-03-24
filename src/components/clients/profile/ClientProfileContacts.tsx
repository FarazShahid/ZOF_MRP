"use client";

import React from "react";
import { GetClientsType } from "@/store/useClientStore";

interface ClientProfileContactsProps {
  client: GetClientsType;
}

export default function ClientProfileContacts({ client }: ClientProfileContactsProps) {
  const contacts = [
    {
      id: "primary",
      name: client.POCName || "Primary Contact",
      role: "Primary",
      email: client.POCEmail || client.Email || "-",
      phone: client.Phone || "-",
    },
  ].filter((c) => c.name !== "-" || c.email !== "-" || c.phone !== "-");

  if (contacts.length === 0) {
    contacts.push({
      id: "primary",
      name: client.POCName || "No contact",
      role: "Primary",
      email: client.POCEmail || client.Email || "-",
      phone: client.Phone || "-",
    });
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">Contacts</h2>
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Name
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Role
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Email
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Phone
              </th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr
                key={contact.id}
                className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-slate-300">{contact.name}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{contact.role}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{contact.email}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{contact.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
