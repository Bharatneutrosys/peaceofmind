"use client";

import { useActionState } from "react";
import { LockKeyhole } from "lucide-react";

import { loginAction, type AdminState } from "@/app/admin/actions";

const initialState: AdminState = { error: null, message: null };

export default function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <section className="mx-auto flex min-h-screen max-w-2xl items-center bg-[#f7f2ea] px-6 py-24 text-stone-900 sm:px-8 lg:px-12">
      <div className="w-full rounded-[2rem] border border-stone-200 bg-white/85 p-6 shadow-[0_24px_80px_rgba(68,64,60,0.14)] backdrop-blur-sm md:p-8">
        <p className="text-xs uppercase tracking-[0.32em] text-stone-500">
          Traveller&apos;s Diary Admin
        </p>
        <h1 className="mt-4 font-serif text-3xl leading-tight text-stone-950 md:text-5xl">
          Enter the passcode to open the admin panel.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-stone-600">
          This panel is for updating the website text, links, and homepage settings.
        </p>

        <form action={formAction} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-[0.28em] text-stone-300/55">
              Passcode
            </span>
            <input
              name="passcode"
              type="password"
              autoComplete="current-password"
              className="mt-3 w-full rounded-[1rem] border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition-colors duration-300 placeholder:text-stone-400 focus:border-stone-700"
              placeholder="Enter admin passcode"
            />
          </label>

          {state.error ? (
            <p className="text-sm leading-7 text-red-700">{state.error}</p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LockKeyhole className="h-4 w-4" />
            {pending ? "Checking..." : "Open Admin"}
          </button>
        </form>
      </div>
    </section>
  );
}
