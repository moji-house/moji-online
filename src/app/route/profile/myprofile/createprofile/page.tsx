'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaUserCircle } from 'react-icons/fa';
import { CreateUserFormData } from '@/app/types/data';

export default function CreateProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState<CreateUserFormData>({
    firstName: '',
    lastName: '',
    birthDate: '',
    showBirthDate: false,
    roles: [],
    education: '',
    currentCompany: '',
    previousCompanies: '',
    email: '',
    phone: '',
    lineContact: '',
    realEstateExperience: '',
    documents: [],
    avatar: null,
    backgroundImage: null,
    bio: '',
    googleId: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name === 'showBirthDate') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'roles') {
      // Handle multiple role selection
      const role = value;
      const updatedRoles = [...formData.roles];
      
      if (checked) {
        if (!updatedRoles.includes(role)) {
          updatedRoles.push(role);
        }
      } else {
        const index = updatedRoles.indexOf(role);
        if (index > -1) {
          updatedRoles.splice(index, 1);
        }
      }
      
      setFormData(prev => ({ ...prev, roles: updatedRoles }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    // For now, just store the file objects
    setFormData(prev => ({
      ...prev,

      documents: [...prev.documents, ...files.map(file => ({ file, url: '', isImage: false }))]
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      // Create FormData object to handle file uploads
      const submitData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'documents') {
          // Skip documents as we'll add them individually
          return;
        } else if (key === 'roles') {
          // Convert array to JSON string
          submitData.append(key, JSON.stringify(formData[key as keyof typeof formData]));
        } else {
          submitData.append(key, formData[key as keyof typeof formData] as string);
        }
      });
      
      // Add each document file
      formData.documents.forEach((doc, index) => {
        if (doc instanceof File) {
          submitData.append(`document_${index}`, doc);
        }
      });
      
      // API call to create profile
      const response = await fetch('/api/profiles/create', {
        method: 'POST',
        body: submitData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Profile created successfully!');
        // Redirect to profile page after successful creation
        setTimeout(() => {
          router.push('/route/profile/myprofile');
        }, 2000);
      } else {
        setMessage(data.error || 'Failed to create profile');
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      setMessage('An error occurred while creating your profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (status === 'loading' || isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create Profile</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          
          {/* Avatar Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative w-24 h-24 border-2 border-gray-300 rounded-full overflow-hidden">
                {formData.avatar ? (
                  <Image
                    src={URL.createObjectURL(formData.avatar)}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <FaUserCircle className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData(prev => ({ ...prev, avatar: file }));
                    }
                  }}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer inline-block"
                >
                  Upload Picture
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  Recommended: Square image, max 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Background Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Image
            </label>
            <div className="relative w-full h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
              {formData.backgroundImage ? (
                <Image
                  src={URL.createObjectURL(formData.backgroundImage)}
                  alt="Background"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No background image</span>
                </div>
              )}
            </div>
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData(prev => ({ ...prev, backgroundImage: file }));
                  }
                }}                
                className="hidden"
                id="background-upload"
              />
              <label
                htmlFor="background-upload"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer inline-block"
              >
                Upload Background
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Recommended: 1920x1080px, max 5MB
              </p>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
              Birth Date
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showBirthDate"
                  name="showBirthDate"
                  checked={formData.showBirthDate}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="showBirthDate" className="ml-2 block text-sm text-gray-700">
                  Show publicly
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Roles */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Roles</h2>
          <p className="text-sm text-gray-600 mb-3">You can select multiple roles</p>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="role-owner"
                name="roles"
                value="Owner"
                checked={formData.roles.includes('Owner')}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="role-owner" className="ml-2 block text-sm text-gray-700">
                Owner
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="role-agent"
                name="roles"
                value="Agent"
                checked={formData.roles.includes('Agent')}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="role-agent" className="ml-2 block text-sm text-gray-700">
                Agent
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="role-customer"
                name="roles"
                value="Customer"
                checked={formData.roles.includes('Customer')}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="role-customer" className="ml-2 block text-sm text-gray-700">
                Customer
              </label>
            </div>
          </div>
        </div>
        
        {/* Education & Work */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Education & Work Experience</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                Education History
              </label>
              <textarea
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="List your educational background"
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="currentCompany" className="block text-sm font-medium text-gray-700 mb-1">
                Current Company/Organization
              </label>
              <input
                type="text"
                id="currentCompany"
                name="currentCompany"
                value={formData.currentCompany}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your current workplace"
              />
            </div>
            
            <div>
              <label htmlFor="previousCompanies" className="block text-sm font-medium text-gray-700 mb-1">
                Previous Companies/Organizations
              </label>
              <textarea
                id="previousCompanies"
                name="previousCompanies"
                value={formData.previousCompanies}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="List your previous workplaces"
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="081-234-5678"
              />
              <p className="mt-1 text-xs text-gray-500">
                Format: 081-234-5678
              </p>
            </div>
            
            <div>
              <label htmlFor="lineContact" className="block text-sm font-medium text-gray-700 mb-1">
                Line Contact URL
              </label>
              <input
                type="url"
                id="lineContact"
                name="lineContact"
                value={formData.lineContact}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://line.me/ti/p/~yourusername"
              />
            </div>
          </div>
        </div>
        
        {/* Real Estate Experience */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Real Estate Experience</h2>
          
          <div>
            <label htmlFor="realEstateExperience" className="block text-sm font-medium text-gray-700 mb-1">
              Experience Details
            </label>
            <textarea
              id="realEstateExperience"
              name="realEstateExperience"
              value={formData.realEstateExperience}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your experience in the real estate industry"
            ></textarea>
          </div>
        </div>
        
        {/* Documents Upload (Only for Owner and Agent) */}
        {(formData.roles.includes('Owner') || formData.roles.includes('Agent')) && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Professional Documents</h2>
            <p className="text-sm text-gray-600 mb-3">
              Upload certificates, professional licenses, or portfolio images
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="documents" className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Documents
                </label>
                <input
                  type="file"
                  id="documents"
                  name="documents"
                  onChange={handleFileUpload}
                  multiple
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <p className="mt-1 text-xs text-gray-500">
                Accepted formats: PDF, JPG, JPEG, PNG (Max 5MB per file)
                </p>
              </div>
              
              {/* Display currently uploaded documents */}
              {formData.documents.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents</h3>
                  <ul className="space-y-2">
                    {formData.documents.map((doc, index) => (
                      <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm truncate">
                          {doc instanceof File ? doc.name : (doc as any).filename || `Document ${index + 1}`}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedDocs = [...formData.documents]
                            updatedDocs.splice(index, 1)
                            setFormData(prev => ({ ...prev, documents: updatedDocs }))
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
