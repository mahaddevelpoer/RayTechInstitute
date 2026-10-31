'use client';

import React, { useState } from 'react';
import { useForm } from '@formspree/react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const FORMSPREE_ID = 'moevylgd';

export const ContactSection: React.FC = () => {
  const [state, handleFormspreeSubmit] = useForm(FORMSPREE_ID);

  const [fields, setFields] = useState({
    name: '',
    email: '',
    subject: '',
    organization: '',
    message: '',
    _gotcha: '',
  });

  const set = (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }));

  if (state.succeeded) {
    return (
      <section id="contact" className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-navy-900 text-lg mb-1">
            Thank you! Your message has been sent.
          </h3>
          <p className="text-slate-600 text-xs">
            We have received your question or request and will review it as soon as possible.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-8 text-center">
          <h2 className="text-xl font-bold text-navy-900 mb-1">
            Have Questions or Need Notes? Contact Us
          </h2>
          <p className="text-slate-600 text-xs">
            Fill out the form below for syllabus guidance, suggestions, or video request.
          </p>
        </div>

        {/* Simple Form */}
        <div className="edu-card p-6 bg-slate-50 border-slate-200">
          <form onSubmit={handleFormspreeSubmit} className="space-y-4">
            
            {/* Honeypot */}
            <input
              type="text"
              name="_gotcha"
              value={fields._gotcha}
              onChange={set('_gotcha')}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="contact-name" name="name"
                  required
                  value={fields.name}
                  onChange={set('name')}
                  placeholder="e.g. Muhammad Ali"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded focus:outline-none focus:border-navy-600 text-slate-800"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="contact-email" name="email"
                  required
                  value={fields.email}
                  onChange={set('email')}
                  placeholder="e.g. student@gmail.com"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded focus:outline-none focus:border-navy-600 text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-subject" className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  id="contact-subject" name="subject"
                  value={fields.subject}
                  onChange={set('subject')}
                  placeholder="e.g. Class and subject notes request"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded focus:outline-none focus:border-navy-600 text-slate-800"
                />
              </div>

              <div>
                <label htmlFor="contact-organization" className="block text-xs font-semibold text-slate-700 mb-1">
                  Board or College (Optional)
                </label>
                <input
                  type="text"
                  id="contact-organization" name="organization"
                  value={fields.organization}
                  onChange={set('organization')}
                  placeholder="e.g. BISE Lahore / Govt College"
                  className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded focus:outline-none focus:border-navy-600 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 mb-1">
                Your Message or Question *
              </label>
              <textarea
                id="contact-message" name="message"
                required
                rows={4}
                value={fields.message}
                onChange={set('message')}
                placeholder="Write your question or request here..."
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded focus:outline-none focus:border-navy-600 text-slate-800"
              />
            </div>

            {state.errors && state.errors.getFormErrors().length > 0 && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Your message could not be sent. Please check the form and try again.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={state.submitting}
              className="btn-primary w-full justify-center py-2.5 text-xs font-semibold"
            >
              {state.submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};
