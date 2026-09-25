import React, { useState } from 'react';
import { Image as ImageIcon, Maximize2, X, ExternalLink, ShieldCheck } from 'lucide-react';
import { SocialReportData, UploadedScreenshot } from '../types/report';

interface ScreengrabsAppendixProps {
  report: SocialReportData;
  onOpenUploadModal: () => void;
}

export const ScreengrabsAppendix: React.FC<ScreengrabsAppendixProps> = ({
  report,
  onOpenUploadModal,
}) => {
  const [selectedImage, setSelectedImage] = useState<UploadedScreenshot | null>(null);

  return (
    <section className="bg-white rounded-xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-stone-100 pb-4 gap-2">
        <div>
          <div className="text-[11px] uppercase tracking-wider font-bold text-stone-500">
            Appendix
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Source Dashboard Screengrabs & Verification
          </h2>
        </div>
        <div className="text-xs text-stone-500 font-medium">
          {report.uploadedScreenshots.length} analytical screengrabs logged for this session
        </div>
      </div>

      {/* Screenshot Gallery */}
      {report.uploadedScreenshots.length === 0 ? (
        <div className="p-8 text-center rounded-xl border border-dashed border-stone-300 bg-stone-50/50 space-y-3">
          <ImageIcon className="w-8 h-8 text-stone-400 mx-auto" />
          <div className="text-xs font-semibold text-stone-700">
            No source dashboard screengrabs attached yet
          </div>
          <p className="text-[11px] text-stone-500 max-w-md mx-auto">
            You can upload Meta Business Suite, YouTube Studio, Instagram Insights, or LinkedIn screengrabs anytime.
          </p>
          <button
            type="button"
            onClick={onOpenUploadModal}
            className="px-3 py-1.5 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition"
          >
            Upload Screengrabs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {report.uploadedScreenshots.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative rounded-lg border border-stone-200 overflow-hidden bg-stone-100 cursor-pointer shadow-2xs hover:shadow-md transition"
            >
              <div className="h-32 w-full overflow-hidden bg-stone-200 flex items-center justify-center">
                <img
                  src={item.dataUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>
              <div className="p-2.5 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                    {item.platform}
                  </span>
                  <Maximize2 className="w-3 h-3 text-stone-400 group-hover:text-stone-800 transition" />
                </div>
                <p className="text-[11px] font-medium text-stone-800 truncate mt-0.5" title={item.name}>
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div>
                <h3 className="text-xs font-bold text-stone-900">{selectedImage.name}</h3>
                <span className="text-[10px] text-stone-500 uppercase">{selectedImage.platform} Dashboard Screengrab</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-auto flex items-center justify-center bg-stone-950">
              <img
                src={selectedImage.dataUrl}
                alt={selectedImage.name}
                className="max-h-[75vh] object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* Agency Sign-off */}
      <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified & Prepared by {report.agencyName}</span>
        </div>
        <div className="text-[11px]">
          Confidential · Prepared exclusively for {report.clientName}
        </div>
      </div>

    </section>
  );
};
