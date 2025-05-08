"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import UsersProperties from "../../../../../components/properties/UsersProperties";

// import userProfilesData from '../../../../data/userProfilesData';

export default function UserProfileDetailPage() {
  const { data: session } = useSession();
  const [userProfiles, setUserProfiles] = useState([]);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileDetail = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/users/profiles/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile details:", error);
        setError("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProfileDetail();
    }
  }, [id]);
  // console.log("userProfilesData", userProfilesData);
  // Handle voting
  const handleVote = async (voteValue) => {
    if (!session) {
      alert("Please sign in to vote");
      return;
    }

    try {
      // In a real application, you would call an API endpoint
      // For now, we'll update the state directly
      setProfile((prevProfile) => ({
        ...prevProfile,
        votes: prevProfile.votes + voteValue,
      }));
    } catch (error) {
      console.error("Error voting for user:", error);
    }
  };

  // Handle following
  const handleFollow = async () => {
    if (!session) {
      alert("Please sign in to follow users");
      return;
    }

    try {
      // In a real application, you would call an API endpoint
      // For now, we'll update the state directly
      setProfile((prevProfile) => ({
        ...prevProfile,
        isFollowing: !prevProfile.isFollowing,
        followers: prevProfile.isFollowing
          ? prevProfile.followers - 1
          : prevProfile.followers + 1,
      }));
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error || "Profile not found"}
        </div>
        <Link
          href="/route/profile/userprofiles"
          className="text-blue-600 hover:underline"
        >
          Back to User Profiles
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/route/profile/userprofiles"
        className="inline-flex items-center text-blue-600 hover:underline mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to User Profiles
      </Link>

      {/* Profile Header */}
      <div className="relative mb-6">
        {/* Background Image */}
        <div className="h-64 rounded-t-lg overflow-hidden">
          <Image
            src={profile.backgroundImage || '/default-background.jpg'}
            alt={`${profile.firstName} ${profile.lastName} background`}
            fill
            className="object-cover"
          />
        </div>

        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
          <div className="flex items-end">
            <div className="mr-4 rounded-full border-4 border-white overflow-hidden">
              <Image
                src={profile.avatar || '/default-avatar.png'}
                alt={`${profile.firstName} ${profile.lastName}`}
                width={120}
                height={120}
                className="object-cover"
              />
            </div>
            <div className="flex-1 text-white">
              <h1 className="text-3xl font-bold">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-lg opacity-90">{profile.company}</p>
              <div className="mt-2">
                <span
                  className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                    profile.roles?.[0]?.role === "Owner"
                      ? "bg-purple-100 text-purple-800"
                      : profile.roles?.[0]?.role === "Agent"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {profile.roles?.[0]?.role || "Visitor"}
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleFollow}
                className={`px-4 py-2 rounded-md font-medium ${
                  profile.isFollowing
                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {profile.isFollowing ? "Following" : "Follow"}
              </button>

              <div className="bg-white bg-opacity-20 rounded-md px-4 py-2 text-blue">
                <span className="font-bold">{profile.followers || 0}</span> Followers
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Details */}
        <div className="lg:col-span-3 space-y-6">
          {/* Bio Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-gray-700 whitespace-pre-line">{profile.bio || "No bio available"}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 mr-2 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {profile.email}
                  </a>
                </div>
              </li>
              {profile.line_id && (
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 mr-2 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Line</p>
                    <a
                      href={`https://line.me/ti/p/${profile.line_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {profile.line_id}
                    </a>
                  </div>
                </li>
              )}
            </ul>

            <div className="mt-6">
              <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                Contact {profile.firstName}
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <span className="block text-2xl font-bold">
                  {profile.votes || 0}
                </span>
                <span className="text-sm text-gray-500">Votes</span>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <span className="block text-2xl font-bold">
                  {profile.followers || 0}
                </span>
                <span className="text-sm text-gray-500">Followers</span>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <span className="block text-2xl font-bold">
                  {profile.properties?.length || 0}
                </span>
                <span className="text-sm text-gray-500">Properties</span>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-md">
                <span className="block text-2xl font-bold">
                  {profile.coinBalance?.balance || 0}
                </span>
                <span className="text-sm text-gray-500">Coins</span>
              </div>
            </div>

            {/* Voting Section */}
            <div className="mt-6">
              <h3 className="font-medium mb-2">Vote for {profile.firstName}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleVote(1)}
                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                  title="Upvote"
                  disabled={!session}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>

                <span className="font-bold text-lg">{profile.votes || 0}</span>

                <button
                  onClick={() => handleVote(-1)}
                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                  title="Downvote"
                  disabled={!session}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Custom Vote Input */}
                <div className="flex items-center ml-2">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    defaultValue="1"
                    className="w-12 px-2 py-1 border border-gray-300 rounded-md text-center"
                    id="vote-input"
                    disabled={!session}
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById("vote-input");
                      const value = parseInt(input.value, 10) || 0;
                      if (value > 0 && value <= 10) {
                        handleVote(value);
                        input.value = "1";
                      }
                    }}
                    className="ml-2 px-2 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={!session}
                  >
                    Vote
                  </button>
                </div>
              </div>

              {!session && (
                <p className="mt-2 text-sm text-gray-500">
                  <Link
                    href="/api/auth/signin"
                    className="text-blue-600 hover:underline"
                  >
                    Sign in
                  </Link>{" "}
                  to vote for this user
                </p>
              )}
            </div>
          </div>

          {/* Properties Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Properties</h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {profile.properties?.length || 0} Listed
            </span>
            <UsersProperties userId={id} />
          </div>

          {/* Reviews Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>

            {/* Mock Reviews */}
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center mb-2">
                    <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden relative mr-3">
                      <Image
                        src={`https://randomuser.me/api/portraits/${
                          index % 2 ? "women" : "men"
                        }/${20 + index}.jpg`}
                        alt="Reviewer"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">
                        {
                          ["Sarah Johnson", "Michael Lee", "Emma Thompson"][
                            index
                          ]
                        }
                      </p>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, starIndex) => (
                          <svg
                            key={starIndex}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-4 w-4 ${
                              starIndex < 4 + (index % 2)
                                ? "fill-current"
                                : "text-gray-300"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    {
                      [
                        "Excellent service! Very knowledgeable about the local market and helped me find exactly what I was looking for.",
                        "Professional and responsive. Made the buying process smooth and stress-free.",
                        "Great experience working with them. Highly recommended for anyone looking for property in Thailand.",
                      ][index]
                    }
                  </p>
                </div>
              ))}
            </div>

            <button className="mt-4 text-blue-600 hover:underline">
              View all reviews
            </button>
          </div>
                    {/* Activity Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {index === 0 ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      ) : index === 1 ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      )}
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm">
                      {index === 0 ? (
                        <>
                          Listed a new property in{" "}
                          <span className="font-medium">Bangkok</span>
                        </>
                      ) : index === 1 ? (
                        <>
                          Updated availability for{" "}
                          <span className="font-medium">Property #2</span>
                        </>
                      ) : (
                        <>
                          Received a new review from{" "}
                          <span className="font-medium">Michael Lee</span>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {index === 0
                        ? "2 days ago"
                        : index === 1
                        ? "1 week ago"
                        : "2 weeks ago"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Contact and Stats */}
        <div className="space-y-6">
          
        </div>
      </div>
    </div>
  );
}
