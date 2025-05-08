"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaBed, FaBath, FaRuler, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import PropertyCard from "@/components/properties/PropertyCard";
import axios from "axios";

export default function SearchProperties() {
  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [areaRange, setAreaRange] = useState({ min: "", max: "" });
  const [location, setLocation] = useState("");
  const [poster, setPoster] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cities, setCities] = useState([]);
  const [posters, setPosters] = useState([]);

  // Fetch properties and filter options from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // สร้าง query parameters
        const params = new URLSearchParams();
        if (searchTerm) params.append('searchTerm', searchTerm);
        if (priceRange.min) params.append('minPrice', priceRange.min);
        if (priceRange.max) params.append('maxPrice', priceRange.max);
        if (bedrooms) params.append('bedrooms', bedrooms);
        if (bathrooms) params.append('bathrooms', bathrooms);
        if (areaRange.min) params.append('minArea', areaRange.min);
        if (areaRange.max) params.append('maxArea', areaRange.max);
        if (location) params.append('city', location);
        if (poster) params.append('posterName', poster);
        
        // Fetch properties with all necessary data
        const response = await fetch(`/api/properties/search?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // เรียงลำดับตาม Points จากมากไปน้อย
        const sortedProperties = data.properties.sort((a, b) => {
          const pointsA = a.points || 0;
          const pointsB = b.points || 0;
          
          if (pointsA !== pointsB) {
            return pointsB - pointsA;
          }
          
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        });
        
        setProperties(sortedProperties);
        setCities(data.cities || []);
        setPosters(data.posters || []);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, priceRange, bedrooms, bathrooms, areaRange, location, poster]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // The filtering is already handled by the useEffect
  };

  // Reset all filters
  const handleReset = () => {
    setSearchTerm("");
    setPriceRange({ min: "", max: "" });
    setBedrooms("");
    setBathrooms("");
    setAreaRange({ min: "", max: "" });
    setLocation("");
    setPoster("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">ค้นหาอสังหาริมทรัพย์</h1>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Keyword Search */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <FaSearch className="inline mr-2" />
              ค้นหาด้วยคำ
            </label>
            <input
              type="text"
              placeholder="ชื่อ, คำอธิบาย, ที่อยู่..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              ช่วงราคา
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="ต่ำสุด"
                value={priceRange.min}
                onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="สูงสุด"
                value={priceRange.max}
                onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <FaBed className="inline mr-2" />
              จำนวนห้องนอน
            </label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">ทั้งหมด</option>
              <option value="1">1 ห้อง</option>
              <option value="2">2 ห้อง</option>
              <option value="3">3 ห้อง</option>
              <option value="4">4 ห้อง</option>
              <option value="5">5+ ห้อง</option>
            </select>
          </div>

          {/* Bathrooms */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <FaBath className="inline mr-2" />
              จำนวนห้องน้ำ
            </label>
            <select
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">ทั้งหมด</option>
              <option value="1">1 ห้อง</option>
              <option value="2">2 ห้อง</option>
              <option value="3">3 ห้อง</option>
              <option value="4">4+ ห้อง</option>
            </select>
          </div>

          {/* Area Range */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <FaRuler className="inline mr-2" />
              ขนาดพื้นที่ (ตร.ม.)
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="ต่ำสุด"
                value={areaRange.min}
                onChange={(e) => setAreaRange({...areaRange, min: e.target.value})}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="สูงสุด"
                value={areaRange.max}
                onChange={(e) => setAreaRange({...areaRange, max: e.target.value})}
                className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <FaMapMarkerAlt className="inline mr-2" />
              เมือง/พื้นที่
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">ทั้งหมด</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Poster */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              <FaUser className="inline mr-2" />
              ผู้โพสต์
            </label>
            <select
              value={poster}
              onChange={(e) => setPoster(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">ทั้งหมด</option>
              {posters.map((name, index) => (
                <option key={index} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            รีเซ็ต
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            ค้นหา
          </button>
        </div>
      </form>

      {/* Results */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          ผลการค้นหา: {properties.length} รายการ
        </h2>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center text-red-500 py-8">
          <p>{error}</p>
        </div>
      )}

      {/* No Results */}
      {!loading && !error && properties.length === 0 && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ไม่พบอสังหาริมทรัพย์ที่ตรงกับเงื่อนไข
          </h3>
          <p className="text-gray-500">
            ลองปรับเปลี่ยนเงื่อนไขการค้นหาของคุณ
          </p>
        </div>
      )}

      {/* Property List */}
      {!loading && !error && properties.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}