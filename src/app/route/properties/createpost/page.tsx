"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CreatePostForm from "../../../../components/properties/CreatePostForm";

export default function CreatePropertyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Check if the user is not authenticated
    if (status === 'unauthenticated') {
      // Redirect to login page
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // Don't render the page content if not authenticated
  if (!session) {
    return null;
  }

  // Your actual page content goes here
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Property Listing</h1>
      <CreatePostForm />
    </div>
  );
}
