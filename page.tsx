'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import Icon from '@/components/ui/AppIcon';
import { CartProvider } from '@/context/CartContext';

interface FeedbackForm {
  name: string;
  age: string;
  locality: string;
  phone: string;
  visitFrequency: string;
  overallRating: number;
  productQuality: number;
  staffBehavior: number;
  cleanliness: number;
  valueForMoney: number;
  favoriteSection: string;
  suggestion: string;
  wouldRecommend: string;
}

const initialForm: FeedbackForm = {
  name: '',
  age: '',
  locality: '',
  phone: '',
  visitFrequency: '',
  overallRating: 0,
  productQuality: 0,
  staffBehavior: 0,
  cleanliness: 0,
  valueForMoney: 0,
  favoriteSection: '',
  suggestion: '',
  wouldRecommend: '',
};

const visitOptions = ['First time', 'Weekly', 'Bi-weekly', 'Monthly', 'Occasionally'];
const sectionOptions = ['Fruits & Vegetables', 'Dairy & Eggs', 'Bakery', 'Meat & Seafood', 'Beverages', 'Snacks', 'Household', 'Personal Care'];

function StarRating({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <div className="flex gap-1 items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all hover:scale-110"
            aria-label={`Rate ${star} out of 5`}
          >
            <svg
              viewBox="0 0 24 24"
              className={`w-7 h-7 transition-colors ${
                star <= (hovered || value) ? 'text-accent fill-accent' : 'text-border fill-border'
              }`}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
        {value > 0 && (
          <span className="ml-2 text-sm font-bold text-primary">
            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][value]}
          </span>
        )}
      </div>
    </div>
  );
}

function FeedbackForm() {
  const [form, setForm] = useState<FeedbackForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FeedbackForm, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState('');

  const set = (field: keyof FeedbackForm, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof FeedbackForm, string>> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.locality.trim()) newErrors.locality = 'Locality is required';
    if (!form.visitFrequency) newErrors.visitFrequency = 'Please select visit frequency';
    if (form.overallRating === 0) newErrors.overallRating = 'Please rate your overall experience';
    if (!form.wouldRecommend) newErrors.wouldRecommend = 'Please select an option';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitting(true);
    setSaveError('');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to save');
      setSubmitted(true);
    } catch (err) {
      setSaveError('There was an error saving your feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
    setSubmitted(false);
    setSaveError('');
  };

  if (submitted) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-16">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="CheckCircleIcon" size={48} className="text-primary" />
          </div>
          <h2 className="text-3xl font-black text-foreground mb-3 tracking-tight">Thank You, {form.name}!</h2>
          <p className="text-muted-foreground text-base mb-2">
            Your feedback has been recorded successfully.
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            We appreciate you taking the time to share your experience at MVA MART. Your insights help us serve our community better.
          </p>
          <div className="bg-secondary rounded-2xl p-5 mb-8 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">Locality</span>
              <span className="font-bold text-foreground">{form.locality}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">Overall Rating</span>
              <span className="font-bold text-primary">{'★'.repeat(form.overallRating)}{'☆'.repeat(5 - form.overallRating)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">Would Recommend</span>
              <span className="font-bold text-foreground">{form.wouldRecommend}</span>
            </div>
          </div>
          <a
            href="https://aheadoftimereal.streamlit.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full justify-center mb-4 flex items-center gap-2"
          >
            <Icon name="ArrowTopRightOnSquareIcon" size={18} className="text-primary-foreground" />
            View Project Feedback Dashboard
          </a>
          <button onClick={handleReset} className="w-full py-3 rounded-xl border border-border text-sm font-bold text-muted-foreground hover:border-primary hover:text-primary transition-all">
            Submit Another Feedback
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-secondary text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            <Icon name="ChatBubbleLeftEllipsisIcon" size={14} className="text-primary" />
            Community Feedback
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight mb-3">
            Share Your <span className="text-primary">Experience</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Help us improve MVA MART for your neighbourhood. Takes less than 2 minutes.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          {/* Basic Information */}
          <section className="bg-card rounded-3xl border border-border p-6 sm:p-8 space-y-5">
            <h2 className="text-lg font-black text-foreground flex items-center gap-2">
              <span className="w-7 h-7 bg-primary text-primary-foreground rounded-full text-xs font-black flex items-center justify-center">1</span>
              Basic Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-semibold text-foreground">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className={`w-full px-4 py-3 rounded-xl border bg-input text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${errors.name ? 'border-destructive' : 'border-border'}`}
                />
                {errors.name && <p className="text-xs text-destructive font-medium">{errors.name}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="age" className="text-sm font-semibold text-foreground">Age</label>
                <input
                  id="age"
                  type="number"
                  min="10"
                  max="100"
                  value={form.age}
                  onChange={(e) => set('age', e.target.value)}
                  placeholder="e.g. 35"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="locality" className="text-sm font-semibold text-foreground">
                  Locality / Area <span className="text-destructive">*</span>
                </label>
                <input
                  id="locality"
                  type="text"
                  value={form.locality}
                  onChange={(e) => set('locality', e.target.value)}
                  placeholder="e.g. Koramangala, Bangalore"
                  className={`w-full px-4 py-3 rounded-xl border bg-input text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all ${errors.locality ? 'border-destructive' : 'border-border'}`}
                />
                {errors.locality && <p className="text-xs text-destructive font-medium">{errors.locality}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-sm font-semibold text-foreground">Phone (optional)</label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground">
                How often do you visit MVA MART? <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {visitOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => set('visitFrequency', opt)}
                    className={`filter-chip ${form.visitFrequency === opt ? 'active' : ''}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {errors.visitFrequency && <p className="text-xs text-destructive font-medium">{errors.visitFrequency}</p>}
            </div>
          </section>

          {/* Ratings */}
          <section className="bg-card rounded-3xl border border-border p-6 sm:p-8 space-y-5">
            <h2 className="text-lg font-black text-foreground flex items-center gap-2">
              <span className="w-7 h-7 bg-primary text-primary-foreground rounded-full text-xs font-black flex items-center justify-center">2</span>
              Rate Your Experience
            </h2>

            <div className="space-y-4">
              <StarRating value={form.overallRating} onChange={(v) => set('overallRating', v)} label="Overall Experience *" />
              {errors.overallRating && <p className="text-xs text-destructive font-medium -mt-2">{errors.overallRating}</p>}
              <div className="h-px bg-border" />
              <StarRating value={form.productQuality} onChange={(v) => set('productQuality', v)} label="Product Quality & Freshness" />
              <div className="h-px bg-border" />
              <StarRating value={form.staffBehavior} onChange={(v) => set('staffBehavior', v)} label="Staff Behaviour & Helpfulness" />
              <div className="h-px bg-border" />
              <StarRating value={form.cleanliness} onChange={(v) => set('cleanliness', v)} label="Store Cleanliness" />
              <div className="h-px bg-border" />
              <StarRating value={form.valueForMoney} onChange={(v) => set('valueForMoney', v)} label="Value for Money" />
            </div>
          </section>

          {/* Additional Details */}
          <section className="bg-card rounded-3xl border border-border p-6 sm:p-8 space-y-5">
            <h2 className="text-lg font-black text-foreground flex items-center gap-2">
              <span className="w-7 h-7 bg-primary text-primary-foreground rounded-full text-xs font-black flex items-center justify-center">3</span>
              A Little More
            </h2>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground">Favourite Section in the Store</label>
              <div className="flex flex-wrap gap-2">
                {sectionOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => set('favoriteSection', form.favoriteSection === opt ? '' : opt)}
                    className={`filter-chip ${form.favoriteSection === opt ? 'active' : ''}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground">
                Would you recommend MVA MART to friends & family? <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-3">
                {['Yes, definitely!', 'Maybe', 'No'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => set('wouldRecommend', opt)}
                    className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                      form.wouldRecommend === opt
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card text-muted-foreground border-border hover:border-primary hover:text-primary'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {errors.wouldRecommend && <p className="text-xs text-destructive font-medium">{errors.wouldRecommend}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="suggestion" className="text-sm font-semibold text-foreground">
                Any suggestions or comments?
              </label>
              <textarea
                id="suggestion"
                rows={4}
                value={form.suggestion}
                onChange={(e) => set('suggestion', e.target.value)}
                placeholder="Tell us what we can do better, or what you love about us..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-input text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
              />
            </div>
          </section>

          {saveError && (
            <p className="text-sm text-destructive font-medium text-center">{saveError}</p>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed">
            <Icon name="PaperAirplaneIcon" size={18} className="text-primary-foreground" />
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function FeedbackPage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <CartSidebar />
        <FeedbackForm />
        <Footer />
      </div>
    </CartProvider>
  );
}
