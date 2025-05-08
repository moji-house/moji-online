import EditPostForm from "@/components/properties/EditPostForm";

export default function EditPost({ params }) {
    return (
        <div>
            <EditPostForm propertyId={params.id} />
        </div>
    )
}