import React, { useState } from 'react';
import Section from '../components/Section';
import Button from '../components/Button';
import { Mail, Phone, MapPin, Clock, Loader2, CheckCircle } from 'lucide-react';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore'; 
import { db } from '../lib/firebase';

const Contact = () => {
  const [contactInfo, setContactInfo] = useState({
    address: '123 Audio Lane, Sound City, SC 90210',
    phone: '+1 (555) 123-4567',
    phones: ['+1 (555) 123-4567'],
    email: 'contact@cinemafocus.com',
    workingHours: "Mon - Fri: 10am - 7pm\nSat - Sun: 11am - 5pm"
  });

  React.useEffect(() => {
    const fetchInfo = async () => {
      try {
        const snap = await getDoc(doc(db, "site_content", "footer"));
        if (snap.exists()) {
           setContactInfo(prev => ({ ...prev, ...snap.data() }));
        }
      } catch (e) {
        console.error("Error fetching contact info", e);
      }
    };
    fetchInfo();
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Enquiry',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        read: false,
        createdAt: new Date().toISOString()
      });
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
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="animate-fade-in">
       <Section className="py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4">Get in Touch</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
           Ready to elevate your home audio experience? Visit our showroom or send us a message.
        </p>
      </Section>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif text-foreground mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                   <div className="p-3 bg-primary/10 text-primary rounded-sm">
                     <MapPin size={24} />
                   </div>
                   <div>
                     <h3 className="font-medium text-lg">Our Showroom</h3>
                     <p className="text-muted-foreground">123 Audio Lane, Sound City, SC 90210</p>
                   </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-sm">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Phone</h3>
                      <div className="text-muted-foreground">
                        {(contactInfo.phones || [contactInfo.phone]).map((p, i) => (
                           <div key={i}>{p}</div>
                        ))}
                      </div>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-sm">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Email</h3>
                      <p className="text-muted-foreground">{contactInfo.email}</p>
                    </div>
                 </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-sm">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Opening Hours</h3>
                      <div className="text-muted-foreground whitespace-pre-wrap">{contactInfo.workingHours || "Mon - Fri: 10am - 7pm\nSat - Sun: 11am - 5pm"}</div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="aspect-video bg-secondary/10 rounded-sm w-full flex items-center justify-center border border-border">
               <span className="text-muted-foreground">Google Map Placeholder</span>
            </div>
          </div>

          {/* Form */}
          <div className="bg-card border border-border p-8 rounded-sm">
            <h2 className="text-2xl font-serif text-foreground mb-6">Send us a Message</h2>
            
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                   <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-medium">Message Sent!</h3>
                <p className="text-muted-foreground">Thank you for contacting us. We will get back to you shortly.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-primary hover:underline mt-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label htmlFor="firstName" className="text-sm font-medium text-muted-foreground">First Name</label>
                     <input required type="text" id="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-input border border-border p-3 rounded-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-foreground" placeholder="John" />
                   </div>
                   <div className="space-y-2">
                     <label htmlFor="lastName" className="text-sm font-medium text-muted-foreground">Last Name</label>
                     <input required type="text" id="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-input border border-border p-3 rounded-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-foreground" placeholder="Doe" />
                   </div>
                 </div>
                 
                 <div className="space-y-2">
                   <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email Address</label>
                   <input required type="email" id="email" value={formData.email} onChange={handleChange} className="w-full bg-input border border-border p-3 rounded-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-foreground" placeholder="john@example.com" />
                 </div>

                  <div className="space-y-2">
                   <label htmlFor="subject" className="text-sm font-medium text-muted-foreground">Subject</label>
                    <select id="subject" value={formData.subject} onChange={handleChange} className="w-full bg-input border border-border p-3 rounded-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-foreground">
                      <option>General Enquiry</option>
                      <option>Product Consultation</option>
                      <option>Support</option>
                      <option>Showroom Visit</option>
                    </select>
                 </div>

                 <div className="space-y-2">
                   <label htmlFor="message" className="text-sm font-medium text-muted-foreground">Message</label>
                   <textarea required id="message" value={formData.message} onChange={handleChange} rows="5" className="w-full bg-input border border-border p-3 rounded-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-foreground" placeholder="How can we help you?"></textarea>
                 </div>

                 <Button className="w-full" size="lg" disabled={submitting}>
                    {submitting ? <Loader2 className="animate-spin mr-2" /> : null}
                    {submitting ? 'Sending...' : 'Send Message'}
                 </Button>
              </form>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Contact;
