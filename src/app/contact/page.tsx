"use client";
import React, { useState } from "react";

const Contact: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function postData(): Promise<Response> {
    const response = await fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, message })
    });

    return response;
  }

  function resetForm(): void {
    setName("");
    setEmail("");
    setMessage("");
  }

  async function sendEmail(e: React.FormEvent): Promise<void> {
    setLoading(true);
    setError(false);
    setSuccess(false);
    e.preventDefault();
    const { status } = await postData();

    if (status === 200) {
      setSuccess(true);
      setLoading(false);
      resetForm();
    } else {
      setLoading(false);
      setError(true);
    }
  }

  return (
    <>
      <h1 className="mb-5 font-Inter text-2xl font-medium tracking-tight text-[#1a202c]">
        Send me an email
      </h1>
      <form className="flex flex-col" onSubmit={sendEmail}>
        <div className="mb-5 rounded bg-slate-100 pt-1 md:w-5/6">
          <label className="pl-3">
            Name:
            <input
              className="w-full  rounded bg-slate-100 pb-3 pl-3 outline-none"
              type="text"
              value={name}
              required
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </label>
        </div>
        <div className="mb-5 rounded bg-slate-100 pt-1 md:w-5/6">
          <label className="pl-3">
            Email:
            <input
              className="w-full  rounded bg-slate-100 pb-3 pl-3 outline-none"
              type="email"
              value={email}
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </label>
        </div>
        <div className="mb-5 rounded bg-slate-100 pt-1 md:w-5/6">
          <label className="pl-3">
            Message:
            <textarea
              className="w-full  rounded bg-slate-100 pb-3 pl-3 outline-none"
              value={message}
              required
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
          </label>
        </div>
        <div>
          <input
            className="h-[40px] w-[150px] cursor-pointer rounded bg-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-slate-300"
            type="submit"
            value="Submit"
            disabled={loading}
          />
          {error && (
            <h2 className="inline-block font-semibold text-red-700 sm:ml-5">
              Email could not be sent, please try again
            </h2>
          )}

          {success && (
            <h2 className="inline-block font-semibold text-green-700 sm:ml-5">
              Thank you for your email
            </h2>
          )}
        </div>
      </form>
    </>
  );
};

export default Contact;
