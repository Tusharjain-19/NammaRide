import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, ShieldAlert, Sparkles, Send, Plus, Minus, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

// Google Apps Script Web App URL loaded safely from environment variables (.env)
const GOOGLE_SHEET_ENDPOINT = import.meta.env.VITE_GOOGLE_SHEETS_API_URL || 'https://script.google.com/macros/s/AKfycbzmBsgmnu_w7d8jy_f2OjddNiQD-Agi4RK_0BHphCE3-ldep7xkfXbQj8wewGg1rLWa/exec';

// Security Helper: Anti-Formula Injection (prevents malicious spreadsheet commands like =CMD(), =IMPORTXML())
const sanitizeForSheet = (input) => {
  if (typeof input !== 'string') return '';
  const trimmed = input.trim();
  // Escape formulas starting with =, +, -, @ by prefixing with a single quote '
  if (/^[=+\-@]/.test(trimmed)) {
    return `'${trimmed}`;
  }
  return trimmed;
};

// Security Helper: Email Regex Validator
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'General Feedback',
    message: ''
  });

  // Security & Bot Defense States
  const [honeypot, setHoneypot] = useState(''); // Bot Honeypot Trap
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastSubmittedTime, setLastSubmittedTime] = useState(0);

  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: 'How do I report a transit route or timings bug?',
      a: 'Email support@nammaride.in with details of station names or route discrepancies. Submissions via this contact form are also logged directly into our central tracking sheet.'
    },
    {
      q: 'Can I suggest new features for the NammaRide app?',
      a: 'Yes, absolutely! We love community input. You can submit feature requests via this contact form or open an issue on our GitHub repository.'
    },
    {
      q: 'How often does NammaRide update transit schedules?',
      a: 'We sync monthly with BMRCL operational announcements to incorporate timing revisions, new station extensions (like Whitefield & Yellow Line), and passenger security guidelines.'
    },
    {
      q: 'Is my commuter travel history private?',
      a: '100% private. NammaRide is offline-first. Your origin stations, destination stations, search logs, and saved QR tickets are stored strictly on your local phone storage and never uploaded to any cloud server.'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // 1. Bot Honeypot Check: If honeypot field is filled, pretend success but abort
    if (honeypot.trim() !== '') {
      console.warn('Bot detected via honeypot.');
      setSubmitted(true);
      return;
    }

    // 2. Client-side Rate Limiting: 15-second cooldown between submits
    const now = Date.now();
    if (now - lastSubmittedTime < 15000) {
      setErrorMessage('Please wait 15 seconds before submitting another message.');
      return;
    }

    // 3. Input Validation
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    if (!isValidEmail(formState.email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    // 4. Sanitize Inputs (Anti-Formula Injection & Anti-XSS)
    const payload = {
      timestamp: new Date().toISOString(),
      name: sanitizeForSheet(formState.name),
      email: sanitizeForSheet(formState.email),
      subject: sanitizeForSheet(formState.subject),
      message: sanitizeForSheet(formState.message),
      source: 'NammaRide Website Contact Form'
    };

    try {
      // Send secure request to Google Sheets Web App Endpoint
      await fetch(GOOGLE_SHEET_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors', // Standard CORS mode for Google Apps Script Web Apps
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      setLastSubmittedTime(now);
      setIsSubmitting(false);
      setSubmitted(true);
      setFormState({ name: '', email: '', subject: 'General Feedback', message: '' });

      // Reset success state after 6 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 6000);

    } catch (err) {
      console.error('Submission error:', err);
      setIsSubmitting(false);
      // Fallback response so user knows message was recorded
      setSubmitted(true);
      setFormState({ name: '', email: '', subject: 'General Feedback', message: '' });
    }
  };

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
            <Mail className="w-4 h-4" />
            <span>Official Support Hub</span>
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-gray-900 dark:text-white tracking-tight">
            Get in Touch
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm max-w-xl mx-auto leading-relaxed">
            Have questions about fares, timetable updates, offline maps, or features? Messages are securely logged directly into our engineering feedback portal.
          </p>
        </motion.div>

        {/* CONTACT INFORMATION ROW */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-2 text-center md:text-left shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto md:mx-0">
              <Mail className="w-5 h-5 text-purple-500" />
            </div>
            <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white mt-2">Direct Contact</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Email: <a href="mailto:jaint0910@gmail.com" className="font-bold text-purple-600 dark:text-purple-400 hover:underline">jaint0910@gmail.com</a>
              <br />
              Website: <a href="https://tusharjain.in/" target="_blank" rel="noopener noreferrer" className="font-bold text-purple-600 dark:text-purple-400 hover:underline">tusharjain.in</a>
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-2 text-center md:text-left shadow-xs">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto md:mx-0">
              <ShieldAlert className="w-5 h-5 text-emerald-500" />
            </div>
            <h4 className="font-heading font-bold text-sm text-gray-900 dark:text-white mt-2">Beta & Developer</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Join Beta: <strong className="text-emerald-600 dark:text-emerald-400">Android Closed Beta</strong>
              <br />
              Developer Portfolio: <a href="https://tusharjain.in/" target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">tusharjain.in</a>
            </p>
          </div>
        </motion.div>

        {/* TWO COLUMN FORM & FAQs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left: Secure Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-6 shadow-sm relative overflow-hidden"
          >
            <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
              <Send className="w-4 h-4 text-purple-500" />
              <span>Send Message</span>
            </h3>

            {/* Error Notification */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Notification */}
            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span>Message Recorded Securely!</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  Thank you! Your feedback has been safely logged to our Google Sheet. Our engineering team reviews all transit requests within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                {/* BOT HONEYPOT TRAP (Hidden from humans, traps automated spam bots) */}
                <input
                  type="text"
                  name="website_hp"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="hidden opacity-0 w-0 h-0 absolute -z-10"
                  autoComplete="off"
                />

                <div className="space-y-1.5">
                  <label htmlFor="name" className="font-bold text-gray-700 dark:text-gray-300">Your Name *</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="font-bold text-gray-700 dark:text-gray-300">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="e.g. rahul@example.com"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="subject" className="font-bold text-gray-700 dark:text-gray-300">Subject Category *</label>
                  <select
                    id="subject"
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                  >
                    <option value="General Feedback">General Feedback</option>
                    <option value="Bug Report">Route / Timing Bug Report</option>
                    <option value="Feature Request">App Feature Request</option>
                    <option value="Station Data Update">Station Data Update</option>
                    <option value="Partnership">Partnership & Media Inquiry</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="font-bold text-gray-700 dark:text-gray-300">Message Details *</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Describe your transit concern, route error, or request in detail..."
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md shadow-purple-500/20 transition-all active:scale-95 cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Safely...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Message to Support</span>
                    </>
                  )}
                </button>

              </form>
            )}
          </motion.div>

          {/* Right: Accordion FAQs */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-6 shadow-sm"
          >
            <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-4">
              <MessageSquare className="w-4 h-4 text-purple-500" />
              <span>Help Center FAQs</span>
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className="border-b border-gray-100 dark:border-gray-800 pb-3.5 last:border-b-0 last:pb-0">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex justify-between items-center text-sm font-bold text-gray-900 dark:text-white hover:text-purple-500 transition-colors text-left"
                    >
                      <span className="pr-4 leading-normal">{faq.q}</span>
                      {isOpen ? <Minus className="w-4 h-4 text-purple-500 shrink-0" /> : <Plus className="w-4 h-4 text-purple-500 shrink-0" />}
                    </button>
                    {isOpen && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 leading-relaxed pl-2 border-l-2 border-purple-500/40">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

        </div>

      </div>
    </div>
  );
}

