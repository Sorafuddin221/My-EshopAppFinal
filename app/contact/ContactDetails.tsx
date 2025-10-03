'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhoneAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import api from '../../utils/api';

interface AddressSettings {
  address: string;
  phoneNumbers: string[];
  emails: string[];
  description: string;
}

const ContactDetails = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [status, setStatus] = useState('');
    const [addressSettings, setAddressSettings] = useState<AddressSettings | null>(null);
    const [loadingAddress, setLoadingAddress] = useState(true);
    const [addressError, setAddressError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAddressSettings = async () => {
            try {
                                const data = await api.get('/address-settings');
                setAddressSettings(data);
            } catch (e: any) {
                setAddressError(e.message);
            } finally {
                setLoadingAddress(false);
            }
        };

        fetchAddressSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        try {
            const response = await api.post('/contact', formData);

            if (response) {
                setStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
            } else {
                setStatus(`error: ${response.message || 'Something went wrong.'}`);
            }
        } catch (error: any) {
            setStatus(`error: ${error.message || 'Network error.'}`);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Contact Form */}
            <div className="flex flex-col">
                <h2 className="text-3xl font-bold mb-2 text-gray-800">Tell Us About Yourself</h2>
                <p className="text-gray-500 mb-8">Your email address will not be published. Required fields are marked by "*"</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="sr-only">Name</label>
                            <input type="text" id="name" name="name" placeholder="Name *" required value={formData.name} onChange={handleChange} className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">Your Email</label>
                            <input type="email" id="email" name="email" placeholder="Your Email *" required value={formData.email} onChange={handleChange} className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="subject" className="sr-only">Subject</label>
                        <input type="text" id="subject" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
                    </div>
                    <div>
                        <label htmlFor="message" className="sr-only">Your Message</label>
                        <textarea id="message" name="message" rows={8} placeholder="Your Message" required value={formData.message} onChange={handleChange} className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"></textarea>
                    </div>
                    <div>
                        <button type="submit" disabled={status === 'sending'} className="bg-gray-800 text-white font-bold py-4 px-10 rounded-md shadow-md hover:bg-gray-900 transition-colors duration-200">
                            {status === 'sending' ? 'SENDING...' : 'SEND'}
                        </button>
                    </div>
                    {status === 'success' && <p className="text-green-500 mt-4">Message sent successfully!</p>}
                    {status.startsWith('error') && <p className="text-red-500 mt-4">{status}</p>}
                </form>
            </div>

            {/* Right Column: Address Details */}
            <div className="flex flex-col">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">Address :</h2>
                <div className="text-gray-500 mb-8">
                    {addressSettings && <p>{addressSettings.description}</p>}
                </div>

                <div className="space-y-6 text-gray-600">
                    {loadingAddress ? (
                        <p>Loading address details...</p>
                    ) : addressError ? (
                        <p className="text-red-500">Error loading address: {addressError}</p>
                    ) : addressSettings ? (
                        <>
                            <div className="flex items-start space-x-4">
                                <span className="text-red-500 text-lg">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                                </span>
                                <span>{addressSettings.address}</span>
                            </div>
                            <div className="flex items-start space-x-4">
                                <span className="text-red-500 text-lg">
                                    <FontAwesomeIcon icon={faPhoneAlt} />
                                </span>
                                <div className="flex flex-col">
                                    {addressSettings.phoneNumbers.map((phone, index) => (
                                        <span key={index}>{phone}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <span className="text-red-500 text-lg">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                </span>
                                <div className="flex flex-col">
                                    {addressSettings.emails.map((email, index) => (
                                        <span key={index}>{email}</span>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <p>No address details available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactDetails;
