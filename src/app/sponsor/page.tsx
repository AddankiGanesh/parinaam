'use client';

import React, { useState } from 'react';
import Link from 'next/link';

function SponsorRegistration() {
  const [company, setCompany] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app this would POST to an API. Here we just mock success.
    console.log('Sponsor details:', { company, contactPerson, email, phone });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h1 className="text-2xl font-bold mb-4">Thank you for registering!</h1>
        <p className="mb-2">We have received your sponsorship request.</p>
        <p className="text-sm text-gray-600">
          Our team will contact you shortly at <span className="font-medium">{email || 'your email'}</span>.
        </p>
        <Link href="/" className="mt-6 text-indigo-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-6">Sponsor Registration</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company">
            Company / Organization
          </label>
          <input
            id="company"
            type="text"
            placeholder="Acme Corp"
            value={company}
            onChange={e => setCompany(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contactPerson">
            Contact Person
          </label>
          <input
            id="contactPerson"
            type="text"
            placeholder="John Doe"
            value={contactPerson}
            onChange={e => setContactPerson(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+1 555 123 4567"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
      {/* Mock contact details for immediate reference */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>For any queries, reach us at:</p>
        <p className="font-medium">sponsor@parinaam.fest</p>
        <p className="font-medium">+91 98765 43210</p>
      </div>
    </div>
  );
}

export default SponsorRegistration;
