"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import Image from "next/image";
import Link from "next/link";
import { 
  FaBed, 
  FaBath, 
  FaRuler, 
  FaMapMarkerAlt, 
  FaUser, 
  FaCalendarAlt,
  FaSpinner,
  FaArrowLeft
} from "react-icons/fa";
import LikeButton from "../../../../components/properties/LikeButton";
import PointDisplay from "../../../../components/properties/PointDisplay";
import PropertiesData from "../../../data/propertyData";

// Define mock data directly in this file
const properties = PropertiesData

// Create a new instance of axios mock adapter
const mock = new MockAdapter(axios, { delayResponse: 800 });

// Setup mock endpoints
mock.onGet(/\/api\/properties\/\d+/).reply((config) => {
  const id = config.url.split('/').pop();
  // console.log("id", id)
  const property = properties.find(p => `${p.id}` === id);
  // console.log("property", property)
  
  if (property) {
    return [200, property];
  } else {
    return [404, { error: "Property not found" }];
  }
});

// Mock endpoints for like functionality
mock.onGet(/\/api\/properties\/\d+\/like/).reply(200, { isLiked: false });
mock.onPost(/\/api\/properties\/\d+\/like/).reply(200, { isLiked: true });

export default function PropertyPostPage() {
  const params = useParams();
  const id = params?.id;
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/properties/${id}`);
        setProperty(response.data);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to load property details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const handleNextImage = () => {
    if (property?.images?.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (property?.images?.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-red-500 text-xl">{error}</p>
        <Link href="/" className="mt-4 inline-block text-blue-500 hover:underline">
          <FaArrowLeft className="inline mr-2" />
          Back to Properties
        </Link>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-500 text-xl">Property not found</p>
        <Link href="/" className="mt-4 inline-block text-blue-500 hover:underline">
          <FaArrowLeft className="inline mr-2" />
          Back to Properties
        </Link>
      </div>
    );
  }

  // Format price with commas
  const formattedPrice = property.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  // Format date
  const formattedDate = new Date(property.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <FaArrowLeft className="mr-2" />
        Back to Properties
      </Link>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Property Images */}
        <div className="relative h-64 md:h-96 w-full">
          {property.images && property.images.length > 0 ? (
            <>
              <Image
                src={property.images[currentImageIndex]}
                alt={property.title}
                fill
                className="object-cover"
              />
              
              {/* Image Navigation */}
              {property.images.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                  >
                    &lt;
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                  >
                    &gt;
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {property.images.length}
                  </div>
                </>
              )}
              
              {/* Property Status Badge */}
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-bold uppercase">
                {property.status}
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p className="text-gray-500">No images available</p>
            </div>
          )}
        </div>
        
        {/* Property Content */}
        <div className="p-6">
          {/* Header with Title and Points */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-0">
              {property.title}
            </h1>
            <div className="flex items-center space-x-4">
              <PointDisplay propertyId={property.id} initialPoints={property.points || 0} />
              <LikeButton propertyId={property.id} />
            </div>
          </div>
          
          {/* Price */}
          <p className="text-2xl text-blue-600 font-bold mb-4">
            ฿{formattedPrice} {property.status === 'for rent' && '/ month'}
          </p>
          
          {/* Location */}
          <div className="flex items-center text-gray-600 mb-6">
            <FaMapMarkerAlt className="mr-2" />
            <p>{property.address}, {property.city}</p>
          </div>
          
          {/* Property Features */}
          <div className="grid grid-cols-3 gap-4 mb-6 border-t border-b border-gray-200 py-4">
            <div className="flex flex-col items-center">
              <FaBed className="text-blue-500 text-xl mb-1" />
              <p className="text-gray-700 font-medium">{property.bedrooms} Bedrooms</p>
            </div>
            <div className="flex flex-col items-center">
              <FaBath className="text-blue-500 text-xl mb-1" />
              <p className="text-gray-700 font-medium">{property.bathrooms} Bathrooms</p>
            </div>
            <div className="flex flex-col items-center">
              <FaRuler className="text-blue-500 text-xl mb-1" />
              <p className="text-gray-700 font-medium">{property.area} m²</p>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
          </div>
          
          {/* Property Owner/Agent */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <FaUser className="text-blue-500" />
              </div>
              <div>
                <p className="font-medium">{property.user?.name || 'Property Owner'}</p>
                <p className="text-gray-500 text-sm">{property.user?.email || 'Contact information not available'}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-gray-500 text-sm">
              <FaCalendarAlt className="mr-2" />
              <p>Listed on {formattedDate}</p>
            </div>
          </div>
          
          {/* Contact Button */}
          <div className="mt-6">
            <a 
              href={`mailto:${property.user?.email || 'info@example.com'}?subject=Inquiry about ${property.title}`}
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-center transition duration-200"
            >
              Contact Owner
            </a>
          </div>
        </div>
      </div>
      
      {/* Similar Properties Section (placeholder) */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Similar Properties</h2>
        <p className="text-gray-500">Similar properties will be displayed here</p>
      </div>
    </div>
  );
}
