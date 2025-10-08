import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React, { useState } from "react";

export default function Contact() {
  const [result, setResult] = useState<string>("");
  const ACCESS_KEY = "b1f88f58-07b2-4b1c-93f7-7bd23a1b9fbe";

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult("Sending...");

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", ACCESS_KEY);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setResult("✅ Message sent successfully!");
        form.reset();
      } else {
        setResult("❌ Submission failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setResult("⚠️ Network error. Please check your connection.");
    }
  };

  return (
    <>
    <Header/>
      <div className="min-h-screen flex flex-col items-center justify-center bg-clip-text from-white to-gray-100 text-center px-6 py-12">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <p className="text-white mb-2 text-sm">Connect With Me</p>
        <h1 className="text-4xl font-bold mb-4 text-white">Get In Touch</h1>
        <p className="text-white mb-10 leading-relaxed">
          Have a project in mind or just want to connect? I'm always open to new
          opportunities, collaborations, or a quick chat about tech and ideas.
          Feel free to reach out—let’s build something great together!
        </p>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="p-8 rounded-2xl shadow-md  space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              className="w-full p-3 border border-gray-300 rounded-lg outline-none text-gray-700 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black"
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg outline-none text-gray-700 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <textarea
            name="message"
            rows={6}
            placeholder="Enter your message"
            required
            className="w-full p-3 border border-gray-300 rounded-lg outline-none text-gray-700 placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black resize-none"
          ></textarea>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 mx-auto"
          >
            Submit now →
          </button>
        </form>

        {/* Status message */}
        {result && (
          <p className="mt-6 text-white font-medium text-lg">{result}</p>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
}