export async function processImageFile(file: File | null | undefined) {
    if (!file || file.size === 0) return null;

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64String = buffer.toString('base64');
        const mimeType = file.type;

        return `data:${mimeType};base64,${base64String}`;
    } catch (error) {
        console.error('Error processing image file:', error);
        return null;
    }
}