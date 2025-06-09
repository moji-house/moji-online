import EditPostForm from "@/components/properties/EditPostForm";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    return (
        <div>
            <EditPostForm propertyId={id} />
        </div>
    )
}