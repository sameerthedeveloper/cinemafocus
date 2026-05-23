"use client";

import React, { useState } from 'react';
import Section from '@/components/Section';
import Button from '@/components/Button';
import { Mail, Phone, MapPin, Clock, Loader2, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function HomeContact({ initialInfo }) {
  const [contactInfo] = useState(initialInfo || {
    address: 'New Decor Towers, 71 Dr. Radhakrishnan Salai, Mylapore, Chennai, Tamil Nadu 600004',
    phones: ['+91 98410 35821'],
    email: 'contact@cinemafocus.in',
    workingHours: 'Mon - Sat: 10am - 7pm\nSunday: By Appointment'
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapHovered, setMapHovered] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Enquiry',
    message: ''
  });
  const supabase = createClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          message: `[Subject: ${formData.subject}]\n\n${formData.message}`,
          read: false,
        });

      if (error) throw error;
      
      setSubmitted(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'General Enquiry',
        message: ''
      });
    } catch (error) {
      console.error("Error submitting message:", error);
      alert("Something went wrong: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <Section id="home-contact" className="border-t border-border bg-secondary/5 !pb-12 md:!pb-16">
      <div className="text-center mb-12 md:mb-16 space-y-4">
        <h2 className="text-4xl md:text-5xl font-medium tracking-tight">Get in Touch.</h2>
        <p className="text-xl text-muted font-light max-w-2xl mx-auto">
           Ready to elevate your home audio experience? Visit our showroom or send us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Contact Info (5 columns) */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h3 className="text-2xl font-medium text-foreground mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                 <div className="p-3 bg-primary/5 text-primary rounded-xl border border-border/50 shrink-0">
                   <MapPin size={22} />
                 </div>
                 <div>
                   <h4 className="font-semibold text-base mb-1">Our Showroom</h4>
                   <p className="text-muted-foreground leading-relaxed font-light">{contactInfo.address}</p>
                 </div>
              </div>

              <div className="flex items-start gap-4">
                 <div className="p-3 bg-primary/5 text-primary rounded-xl border border-border/50 shrink-0">
                   <Phone size={22} />
                 </div>
                 <div>
                   <h4 className="font-semibold text-base mb-1">Phone</h4>
                   <div className="text-muted-foreground font-light space-y-0.5">
                     {(contactInfo.phones || [contactInfo.phone]).map((p, i) => (
                        <div key={i}>{p}</div>
                     ))}
                   </div>
                 </div>
              </div>

              <div className="flex items-start gap-4">
                 <div className="p-3 bg-primary/5 text-primary rounded-xl border border-border/50 shrink-0">
                   <Mail size={22} />
                 </div>
                 <div>
                   <h4 className="font-semibold text-base mb-1">Email</h4>
                   <p className="text-muted-foreground font-light">{contactInfo.email}</p>
                 </div>
              </div>

              <div className="flex items-start gap-4">
                 <div className="p-3 bg-primary/5 text-primary rounded-xl border border-border/50 shrink-0">
                   <Clock size={22} />
                 </div>
                 <div>
                   <h4 className="font-semibold text-base mb-1">Opening Hours</h4>
                   <div className="text-muted-foreground font-light whitespace-pre-wrap leading-relaxed">
                     {contactInfo.workingHours || "Mon - Sat: 10am - 7pm\nSunday: By Appointment"}
                   </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Interactive Google Map */}
          <div className="relative w-full h-[260px] rounded-2xl overflow-hidden border border-border bg-card shadow-lg group">
            {!mapLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-card animate-pulse">
                <Loader2 className="animate-spin text-primary mb-2" size={32} />
                <span className="text-muted-foreground text-sm font-medium">Loading Interactive Map...</span>
              </div>
            )}
            <iframe
              title="Cinema Focus Showroom Location"
              src="https://maps.google.com/maps?q=Cinema%20Focus%2C%20Dr.%20Radhakrishnan%20Salai%2C%20Mylapore%2C%20Chennai%2C%20Tamil%20Nadu%20600004&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className={`w-full h-full border-0 transition-all duration-700 ${
                mapLoaded ? 'opacity-85' : 'opacity-0'
              }`}
              style={{
                filter: mapHovered 
                  ? 'none' 
                  : 'grayscale(0.8) invert(0.92) contrast(1.1) brightness(0.85) saturate(0.5)',
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setMapLoaded(true)}
              onMouseEnter={() => setMapHovered(true)}
              onMouseLeave={() => setMapHovered(false)}
            ></iframe>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none sm:pointer-events-auto">
              <a 
                href="https://maps.google.com/?q=Cinema+Focus+Mylapore+Chennai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-background/90 backdrop-blur-md border border-border text-foreground hover:text-primary rounded-xl text-sm font-medium shadow-md transition-all duration-300 transform hover:scale-105"
              >
                <MapPin size={16} className="text-primary" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form (7 columns) */}
        <div className="lg:col-span-7 bg-card border border-border p-8 rounded-2xl shadow-sm">
          <h3 className="text-2xl font-medium text-foreground mb-6">Send us a Message</h3>
          
          {submitted ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                 <CheckCircle size={32} />
              </div>
              <h4 className="text-xl font-medium">Message Sent!</h4>
              <p className="text-muted-foreground font-light max-w-sm mx-auto">
                Thank you for contacting us. We will review your message and get back to you shortly.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-primary hover:underline mt-4 font-medium transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label htmlFor="firstName" className="text-sm font-medium text-muted-foreground">First Name</label>
                   <input 
                     required 
                     type="text" 
                     id="firstName" 
                     value={formData.firstName} 
                     onChange={handleChange} 
                     className="w-full bg-input border border-border p-3 rounded-xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-foreground" 
                     placeholder="John" 
                   />
                 </div>
                 <div className="space-y-2">
                   <label htmlFor="lastName" className="text-sm font-medium text-muted-foreground">Last Name</label>
                   <input 
                     required 
                     type="text" 
                     id="lastName" 
                     value={formData.lastName} 
                     onChange={handleChange} 
                     className="w-full bg-input border border-border p-3 rounded-xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-foreground" 
                     placeholder="Doe" 
                   />
                 </div>
               </div>
               
               <div className="space-y-2">
                 <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email Address</label>
                 <input 
                   required 
                   type="email" 
                   id="email" 
                   value={formData.email} 
                   onChange={handleChange} 
                   className="w-full bg-input border border-border p-3 rounded-xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-foreground" 
                   placeholder="john@example.com" 
                 />
               </div>

               <div className="space-y-2">
                 <label htmlFor="subject" className="text-sm font-medium text-muted-foreground">Subject</label>
                 <select 
                   id="subject" 
                   value={formData.subject} 
                   onChange={handleChange} 
                   className="w-full bg-input border border-border p-3 rounded-xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-foreground"
                 >
                   <option>General Enquiry</option>
                   <option>Product Consultation</option>
                   <option>Support</option>
                   <option>Showroom Visit</option>
                 </select>
               </div>

               <div className="space-y-2">
                 <label htmlFor="message" className="text-sm font-medium text-muted-foreground">Message</label>
                 <textarea 
                   required 
                   id="message" 
                   value={formData.message} 
                   onChange={handleChange} 
                   rows="5" 
                   className="w-full bg-input border border-border p-3 rounded-xl focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-foreground resize-none" 
                   placeholder="How can we help you?"
                 ></textarea>
               </div>

               <Button className="w-full rounded-full" size="lg" disabled={submitting}>
                  {submitting && <Loader2 className="animate-spin mr-2" />}
                  {submitting ? 'Sending...' : 'Send Message'}
               </Button>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
}
