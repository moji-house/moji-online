'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function DocumentUploadPreview({ document, onRemove }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Determine if the document is an image
  const isImage = document.type && document.type.startsWith('image/');
  
  // Determine if the document is a PDF
  const isPdf = document.type === 'application/pdf';
  
  return (
    <div className="border rounded-md p-3 bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium truncate">
          {document.filename || document.name || 'Document'}
        </span>
        <div className="flex space-x-2">
          {document.url && (
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Preview
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Remove
          </button>
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        {document.size && (
          <p>Size: {(document.size / 1024).toFixed(2)} KB</p>
        )}
        {document.type && (
          <p>Type: {document.type.split('/')[1]?.toUpperCase() || document.type}</p>
        )}
      </div>
      
      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium">{document.filename || document.name}</h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <div className="p-4">
              {isImage && document.url && (
                <div className="relative h-[60vh]">
                  <Image
                    src={document.url}
                    alt={document.filename || document.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              {isPdf && document.url && (
                <iframe
                  src={document.url}
                  className="w-full h-[60vh]"
                  title={document.filename || document.name}
                />
              )}
              {!isImage && !isPdf && document.url && (
                <div className="text-center py-8">
                  <p>Preview not available for this file type.</p>
                  <a
                    href={document.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Download File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
