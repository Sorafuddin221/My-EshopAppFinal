'use client';

import { useState, useEffect } from 'react';
import api from '../../utils/api';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
}

export default function ContactInfoSection() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await api.get('/contact');
        setMessages(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  if (loading) return <div className="text-center py-4">Loading messages...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Form Submissions</h2>
      {messages.length === 0 ? (
        <p className="text-gray-600">No contact messages received yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Message</th>
                <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Received At</th>
                <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id} className="hover:bg-gray-100">
                  <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{msg.name}</td>
                  <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{msg.email}</td>
                  <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{msg.subject || 'N/A'}</td>
                  <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{msg.message}</td>
                  <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">{new Date(msg.createdAt).toLocaleString()}</td>
                  <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-800">
                    <button
                      onClick={() => handleViewMessage(msg)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Message Details</h3>
            <div className="mb-4">
              <p className="text-gray-700"><strong>Name:</strong> {selectedMessage.name}</p>
              <p className="text-gray-700"><strong>Email:</strong> {selectedMessage.email}</p>
              <p className="text-gray-700"><strong>Subject:</strong> {selectedMessage.subject || 'N/A'}</p>
              <p className="text-gray-700"><strong>Received At:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
            </div>
            <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-gray-800 font-semibold mb-2">Message:</p>
              <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
