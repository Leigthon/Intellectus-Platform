import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { contactInfo, subjects } from "@/mockData";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: subjects?.[0]?.name ?? "Mathematics",
    message: "",
  });

  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const canSubmit = useMemo(() => {
    return (
      form.name.trim() &&
      form.email.trim() &&
      form.phone.trim() &&
      form.message.trim()
    );
  }, [form]);

  function update(key) {
    return (e) => {
      setForm((f) => {
        // @ts-expect-error - dynamic key update is safe here (all values are strings)
        return { ...f, [key]: e.target.value };
      });
    };
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("https://formspree.io/f/xojnvwbp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message,
          // Helps "Reply" button work nicely in most email clients
          _replyto: form.email,
          // Optional: custom email subject (if your Formspree template supports it)
          // _subject: `New message - ${form.subject}`,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setMessage("Thank you! We'll get back to you soon.");
        setForm({
          name: "",
          email: "",
          phone: "",
          subject: subjects?.[0]?.name ?? "Mathematics",
          message: "",
        });
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setStatus("error");
      setMessage("Something went wrong. Please try again or use WhatsApp/phone.");
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-[#2c3e73] mb-3">Contact</h1>
          <p className="text-gray-600 text-lg">
            Tell us what you need help with and we’ll get back to you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-white border-2">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-[#2c3e73] mb-6">
                Book a session
              </h2>

              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      value={form.name}
                      onChange={update("name")}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1ac8db]"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      value={form.email}
                      onChange={update("email")}
                      type="email"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1ac8db]"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      value={form.phone}
                      onChange={update("phone")}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1ac8db]"
                      placeholder="e.g. 068 123 4567"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <select
                      value={form.subject}
                      onChange={update("subject")}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#1ac8db]"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={form.message}
                    onChange={update("message")}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 min-h-[140px] focus:outline-none focus:ring-2 focus:ring-[#1ac8db]"
                    placeholder="What are you struggling with? When do you want to start?"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!canSubmit || status === "sending"}
                  className="w-full bg-[#1ac8db] hover:bg-[#15a3c0] text-white py-3"
                >
                  {status === "sending" ? "Sending..." : "Send"}
                </Button>

                {status === "success" && (
                  <p className="text-center text-green-600 font-medium mt-2">
                    {message}
                  </p>
                )}
                {status === "error" && (
                  <p className="text-center text-red-600 font-medium mt-2">
                    {message}
                  </p>
                )}

                <p className="text-xs text-gray-500">
                  Prefer WhatsApp/phone? Use the contact details on the right.
                </p>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-white border-2">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-[#2c3e73] mb-6">
                  Contact details
                </h2>
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#1ac8db] mt-0.5" />
                    <div className="space-y-1">
                      {contactInfo.phone.map((p) => (
                        <a
                          key={p}
                          href={`tel:${p.replace(/\s/g, "")}`}
                          className="block hover:text-[#1ac8db]"
                        >
                          {p}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#1ac8db] mt-0.5" />
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="hover:text-[#1ac8db]"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#1ac8db] mt-0.5" />
                    <div>
                      <div>{contactInfo.address}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {contactInfo.hours}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t">
                  <Link to="/pricing">
                    <Button variant="outline" className="w-full">
                      View Pricing
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}