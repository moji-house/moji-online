'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Button from '../ui/Button';
import Loader from '../ui/Loader';
import Link from 'next/link';

const UserProfile = () => {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState({
    user: null,
    properties: [],
    savedProperties: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          const data = await response.json();
          setUserData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    if (status !== 'loading') {
      fetchUserData();
    }
  }, [session, status]);

  if (status === 'loading') {
    return <Loader />;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold mb-4">Please sign in to view your profile</h2>
      </div>
    );
  }

  const { user, properties, savedProperties } = userData;

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative w-32 h-32 rounded-full overflow-hidden">
            {session.user.image ? (
              <Image 
                src={session.user.image} 
                alt={session.user.name || 'User'} 
                fill 
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-3xl text-gray-500">{session.user.name?.charAt(0) || 'U'}</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold">{session.user.name || 'User'}</h1>
            <p className="text-gray-600 mb-2">{session.user.email}</p>
            <p className="text-gray-500 mb-4">
              Member since {new Date(user?.createdAt || session.user.createdAt || Date.now()).toLocaleDateString()}
            </p>
            <Button>Edit Profile</Button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">My Properties</h2>
        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : properties.length === 0 ? (
          <p className="text-gray-500">You haven't listed any properties yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {property.images && property.images[0] && (
                  <div className="relative h-48">
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{property.title}</h3>
                  <p className="text-gray-600 mb-2">${property.price.toLocaleString()}</p>
                  <p className="text-gray-500 text-sm mb-4">{property.city}</p>
                  <div className="flex justify-between">
                    <Link href={`/properties/edit/${property.id}`}>
                      <Button>Edit</Button>
                    </Link>
                    <Button variant="outline">Delete</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Saved Properties</h2>
        {loading ? (
          <Loader />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : savedProperties.length === 0 ? (
          <p className="text-gray-500">You haven't saved any properties yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {property.images && property.images[0] && (
                  <div className="relative h-48">
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{property.title}</h3>
                  <p className="text-gray-600 mb-2">${property.price.toLocaleString()}</p>
                  <p className="text-gray-500 text-sm mb-4">{property.city}</p>
                  <Link href={`/properties/${property.id}`}>
                    <Button>View Details</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
