"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useUserProfile } from "@/context/UserProfileContext";

export default function UserProfilesPage() {
  const { data: session, status } = useSession();
  const { userProfiles, isLoading, error, handleVote, handleFollow } = useUserProfile();
  const [sortOrder, setSortOrder] = useState("votes");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Filter and sort profiles
  const filteredAndSortedProfiles = userProfiles
    .filter((profile) => {
      console.log("profile==>", profile)
      const fullName = `${profile.firstName} ${profile.lastName}`.toLowerCase();
      const searchMatch =
        fullName.includes(searchTerm.toLowerCase()) ||
        profile.currentCompany.toLowerCase().includes(searchTerm.toLowerCase());

      const roleMatch = roleFilter === "all" || profile.role === roleFilter;

      return searchMatch && roleMatch;
    })
    .sort((a, b) => {
      if (sortOrder === "votes") {
        return b.votes - a.votes;
      } else if (sortOrder === "followers") {
        return b.followers - a.followers;
      } else if (sortOrder === "properties") {
        return b.properties - a.properties;
      } else if (sortOrder === "name") {
        return `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`
        );
      }
      return 0;
    });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Profiles</h1>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="Owner">Owner</option>
              <option value="Agent">Agent</option>
              <option value="Customer">Customer</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="votes">Sort by Votes</option>
              <option value="followers">Sort by Followers</option>
              <option value="properties">Sort by Properties</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAndSortedProfiles.map((profile) => (
          <div
            key={profile.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* Background Image */}
            <div className="relative h-32">
              <Image
                src={profile.backgroundImage || 'https://placehold.co/1200x400?text=Background'}
                alt={`${profile.firstName} ${profile.lastName} background`}
                fill
                className="object-cover"
              />
            </div>

            {/* Profile Content */}
            <div className="p-4 pt-14 relative">
              {/* Avatar */}
              <div className="absolute -top-10 left-4 rounded-full border-4 border-white overflow-hidden">
                <Image
                  src={profile.avatar || 'https://placehold.co/150x150?text=User'}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>

              {/* User Info */}
              <div className="mb-4">
                <h2 className="text-xl font-bold">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-600">{profile.currentCompany}</p>
                <div className="mt-1">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      profile.role === "Owner"
                        ? "bg-purple-100 text-purple-800"
                        : profile.role === "Agent"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {profile.role}
                  </span>
                </div>
              </div>

              {/* Stats and Actions */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4">
                  <div className="text-center">
                    <span className="block font-bold">{profile.votes}</span>
                    <span className="text-xs text-gray-500">Votes</span>
                  </div>
                  <div className="text-center">
                    <span className="block font-bold">{profile.followers}</span>
                    <span className="text-xs text-gray-500">Followers</span>
                  </div>
                  <div className="text-center">
                    <span className="block font-bold">
                      {profile.properties}
                    </span>
                    <span className="text-xs text-gray-500">Properties</span>
                  </div>
                </div>
              </div>

              {/* Voting and Follow */}
              <div className="flex items-center space-x-2 mb-4">
                <button
                  onClick={() => handleFollow(profile.id)}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    profile.isFollowing
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {profile.isFollowing ? "Following" : "Follow"}
                </button>
                <input
                  type="number"
                  min="1"
                  max="10"
                  defaultValue="1"
                  className="w-12 px-2 py-1 border border-gray-300 rounded-md text-center"
                  id={`vote-input-${profile.id}`}
                  disabled={!session}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById(
                      `vote-input-${profile.id}`
                    ) as HTMLInputElement;
                    const value = parseInt(input?.value, 10) || 0;
                    if (value > 0 && value <= 10 && profile.id) {
                      handleVote(profile.id.toString(), value);
                      input.value = "1";
                    }
                  }}
                  className="ml-2 px-2 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={!session}
                >
                  Vote
                </button>
              </div>

              {/* See Profile Link */}
              <Link
                href={`/route/profile/userprofiles/${profile.id}`}
                className="block text-center py-2 bg-gray-100 text-blue-600 hover:bg-gray-200 rounded-md transition"
              >
                See Profile Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedProfiles.length === 0 && (
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No profiles found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria to find what you're
            looking for.
          </p>
        </div>
      )}

      {/* Sign In Prompt */}
      {!session && (
        <div className="mt-8 bg-blue-50 p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-blue-700">
              Sign in to vote for users and follow your favorite real estate
              professionals.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
