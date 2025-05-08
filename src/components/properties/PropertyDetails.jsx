import LikeButton from "./LikeButton";

// Add this somewhere in your PropertyDetails component
<div className="flex items-center mt-4">
  <span className="text-gray-700 mr-2">Add to favorites:</span>
  <LikeButton propertyId={property.id} />
  <span className="ml-2 text-gray-500">{property.likeCount || 0} likes</span>
</div>
