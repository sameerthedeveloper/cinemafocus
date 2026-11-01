"use client";

import React, { useState } from 'react';
import clsx from 'clsx';
import { Mail, Phone, MapPin, Clock, Loader2, Check, ArrowRight } from 'lucide-react';
import { createMessage } from '@/lib/aws/adapter';
import { CINEMA_FOCUS_GEO as geo } from '@/lib/geoContext';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const field =
  'h-12 w-full rounded-control border border-input bg-background px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground focus-visible:ring-2 focus-visible:ring-primary/20 md:text-sm';
const labelClass = 'mb-1.5 block text-sm font-medium';
const pill = 'inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-medium tracking-tight transition-colors';

const SUBJECTS = ['General enquiry', 'Product consultation', 'Support', 'Showroom visit'];
const EMPTY = { firstName: '', lastName: '', email: '', subject: SUBJECTS[0], message: '' };

const Row = ({ icon: Icon, title, children }) => (
  <div className="flex gap-4">
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary">
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
    <div className="min-w-0">
      <h3 className="text-lg font-medium">{title}</h3>
      <div className="text-muted-foreground">{children}</div>
    </div>
  </div>
);

export default function ContactClient({ initialInfo }) {
  const info = initialInfo || {};
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(EMPTY);

  const email = info.email || geo.email;
  const phones = (info.phones && info.phones.length ? info.phones : [info.phone || geo.mobile]).filter(Boolean);
  const address = info.address || geo.address;
  const hours = info.workingHours || 'Monday to Saturday, 11 am to 8 pm';
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(geo.address)}`;

  const handleChange = (e) => setFormData((d) => ({ ...d, [e.target.id]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await createMessage({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        subject: formData.subject,
        text: formData.message,
      });
      setSubmitted(true);
      setFormData(EMPTY);
    } catch (err) {
      console.error('Error submitting message:', err);
      setError(`We could not send your message. Please try again, or email us at ${email}.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-32 md:px-8 md:pb-24 md:pt-40">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-medium tracking-tight md:text-5xl">Contact us</h1>
        <p className="mt-3 text-lg text-muted-foreground md:text-xl">
          Ask about a system, plan a demo or get support. Send a message, or visit the showroom in {geo.locality}.
        </p>
      </header>

      <div className="mt-10 grid gap-10 md:mt-14 lg:grid-cols-12 lg:gap-12">
        {/* Details + map */}
        <div className="space-y-8 lg:col-span-5">
          <div className="space-y-6">
            <Row icon={MapPin} title="Showroom">
              <p className="whitespace-pre-line">{address}</p>
            </Row>
            <Row icon={Phone} title="Phone">
              {phones.map((p, i) => (
                <div key={i}>
                  <a href={`tel:${String(p).replace(/[^+\d]/g, '')}`} className="transition-colors hover:text-foreground">
                    {p}
                  </a>
                </div>
              ))}
            </Row>
            <Row icon={Mail} title="Email">
              <a href={`mailto:${email}`} className="break-all transition-colors hover:text-foreground">{email}</a>
            </Row>
            <Row icon={Clock} title="Opening hours">
              <p className="whitespace-pre-line">{hours}</p>
            </Row>
          </div>

          <div className="relative h-[280px] overflow-hidden rounded-panel bg-secondary md:h-[320px]">
            <iframe
              title="Cinema Focus showroom location"
              src="https://maps.google.com/maps?q=Cinema%20Focus%2C%20Dr.%20Radhakrishnan%20Salai%2C%20Mylapore%2C%20Chennai%2C%20Tamil%20Nadu%20600004&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="absolute inset-0 h-full w-full border-0 grayscale transition-[filter] duration-700 hover:grayscale-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx('absolute bottom-4 left-4 inline-flex h-10 items-center gap-1.5 rounded-full bg-background px-4 text-sm font-medium shadow-float transition-colors hover:bg-secondary', focusRing)}
            >
              Get directions
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Form */}
        <section aria-labelledby="contact-form-title" className="rounded-panel bg-secondary/40 p-6 md:p-10 lg:col-span-7">
          <h2 id="contact-form-title" className="text-2xl font-medium tracking-tight md:text-3xl">Send us a message</h2>

          {submitted ? (
            <div className="py-12 text-center md:py-16" role="status">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-background">
                <Check className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-xl font-medium">Message sent</h3>
              <p className="mx-auto mt-2 max-w-sm text-muted-foreground">Thank you for contacting us. We will get back to you soon.</p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className={clsx(pill, 'mt-8 bg-background hover:bg-accent', focusRing)}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className={labelClass}>First name</label>
                  <input required type="text" id="firstName" autoComplete="given-name" value={formData.firstName} onChange={handleChange} className={field} />
                </div>
                <div>
                  <label htmlFor="lastName" className={labelClass}>Last name</label>
                  <input required type="text" id="lastName" autoComplete="family-name" value={formData.lastName} onChange={handleChange} className={field} />
                </div>
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <input required type="email" id="email" autoComplete="email" value={formData.email} onChange={handleChange} className={field} />
              </div>

              <div>
                <label htmlFor="subject" className={labelClass}>Subject</label>
                <select id="subject" value={formData.subject} onChange={handleChange} className={clsx(field, 'appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10')} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23737373' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}>
                  {SUBJECTS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className={labelClass}>Message</label>
                <textarea required id="message" value={formData.message} onChange={handleChange} rows={5} className={clsx(field, 'h-auto resize-none py-3')} placeholder="Tell us about your room, your music, or what you would like to hear." />
              </div>

              {error && (
                <p role="alert" className="text-sm text-danger">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className={clsx(pill, 'w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60', focusRing)}
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {submitting ? 'Sending' : 'Send message'}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
