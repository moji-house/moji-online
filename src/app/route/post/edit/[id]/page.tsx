import EditPostForm from "@/components/properties/EditPostForm";

export default function EditPost({ params }: { params: { id: string } }) {
    return (
        <div>
            <EditPostForm propertyId={params.id} />
        </div>
    )
}