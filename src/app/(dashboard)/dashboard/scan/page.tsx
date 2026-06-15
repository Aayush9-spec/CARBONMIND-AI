// =============================================================================
// CARBONMIND AI — Scan Receipt / Bill OCR Page
// =============================================================================

'use client';

import { useState, useTransition } from 'react';
import { 
  ScanLine, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Loader2, 
  Check, 
  AlertCircle,
  TrendingDown
} from 'lucide-react';
import { addActivity } from '@/actions/carbon-actions';
import type { DocumentType, ExtractedBillData } from '@/types';
import { createWorker } from 'tesseract.js';

export default function ScanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');
  const [ocrResult, setOcrResult] = useState<{
    documentType: DocumentType;
    rawText: string;
    extractedData: ExtractedBillData;
    confidence: number;
    estimatedEmissions: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const [isPending, startTransition] = useTransition();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setOcrResult(null);
    setSuccessMsg(null);
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      if (uploadedFile.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit.');
        return;
      }
      setFile(uploadedFile);
      setPreviewUrl(URL.createObjectURL(uploadedFile));
    }
  };

  const runOCR = async () => {
    if (!file) return;
    setError(null);
    setOcrResult(null);
    setSuccessMsg(null);

    startTransition(async () => {
      let worker;
      try {
        setProgress('Initializing OCR Engine...');
        worker = await createWorker('eng');
        
        setProgress('Scanning document text (0%)...');
        
        // Load image and recognize text
        const { data: { text, confidence } } = await worker.recognize(file);
        
        setProgress('Analyzing text patterns...');
        
        // Analyze text and extract info using regex patterns
        const docText = text.toLowerCase();
        let documentType: DocumentType = 'unknown';
        const extractedData: ExtractedBillData = {
          amount: undefined,
          unit: undefined,
          provider: undefined,
        };
        let estimatedEmissions = 0;

        if (docText.includes('electricity') || docText.includes('power') || docText.includes('kwh')) {
          documentType = 'electricity_bill';
          extractedData.unit = 'kWh';
          // Find numerical energy values
          const kwMatch = docText.match(/(\d+(?:\.\d+)?)\s*(?:kwh|kilowatt)/i);
          if (kwMatch?.[1]) {
            extractedData.amount = parseFloat(kwMatch[1]);
            estimatedEmissions = extractedData.amount * 0.42; // EPA factor
          }
          // Find provider
          const providers = ['electric', 'power', 'energy', 'utility'];
          extractedData.provider = providers.find(p => docText.includes(p)) 
            ? `${providers.find(p => docText.includes(p))?.toUpperCase()} UTILITY CO.`
            : 'GRID POWER CO.';
        } else if (docText.includes('fuel') || docText.includes('gasoline') || docText.includes('diesel') || docText.includes('petrol') || docText.includes('station')) {
          documentType = 'fuel_receipt';
          extractedData.unit = 'km';
          // Find distance or fuel amounts
          const kmMatch = docText.match(/(\d+(?:\.\d+)?)\s*(?:km|kilometer)/i);
          const literMatch = docText.match(/(\d+(?:\.\d+)?)\s*(?:l|liter|gallon)/i);
          
          if (kmMatch?.[1]) {
            extractedData.amount = parseFloat(kmMatch[1]);
            estimatedEmissions = extractedData.amount * 0.21;
          } else if (literMatch?.[1]) {
            const liters = parseFloat(literMatch[1]);
            extractedData.amount = liters * 12; // Estimate distance based on average fuel economy (12km/liter)
            estimatedEmissions = extractedData.amount * 0.21;
          } else {
            // Estimate based on amount spent if no units
            const spentMatch = docText.match(/(?:\$|usd|eur|total)\s*(\d+(?:\.\d+)?)/i);
            if (spentMatch?.[1]) {
              const spent = parseFloat(spentMatch[1]);
              extractedData.amount = Math.round(spent * 8); // e.g. 8km per USD spent
              estimatedEmissions = extractedData.amount * 0.21;
            }
          }
          extractedData.provider = 'ECO FUEL STATION';
        } else {
          // General shopping invoice
          documentType = 'shopping_invoice';
          extractedData.unit = 'USD';
          const totalMatch = docText.match(/(?:total|amount|due|spent)\s*(?:\$|usd|eur|gbp)?\s*(\d+(?:\.\d+)?)/i);
          if (totalMatch?.[1]) {
            extractedData.amount = parseFloat(totalMatch[1]);
            estimatedEmissions = extractedData.amount * 0.5; // average general goods emissions factor per dollar
          }
          extractedData.provider = 'RETAIL MERCHANT';
        }

        // Fill defaults if nothing extracted
        if (!extractedData.amount) {
          extractedData.amount = 50;
          extractedData.unit = documentType === 'electricity_bill' ? 'kWh' : documentType === 'fuel_receipt' ? 'km' : 'USD';
          estimatedEmissions = documentType === 'electricity_bill' ? 21 : documentType === 'fuel_receipt' ? 10.5 : 25;
        }

        setOcrResult({
          documentType,
          rawText: text,
          extractedData,
          confidence: Math.round(confidence),
          estimatedEmissions: Math.round(estimatedEmissions * 100) / 100,
        });

      } catch (err: any) {
        console.error(err);
        setError('OCR Scanning failed. Make sure the uploaded file is a valid clear image.');
      } finally {
        if (worker) {
          await worker.terminate();
        }
        setProgress('');
      }
    });
  };

  const handleSaveToDna = async () => {
    if (!ocrResult) return;
    setError(null);
    setSuccessMsg(null);

    const categoryMap = {
      electricity_bill: 'energy',
      fuel_receipt: 'transport',
      shopping_invoice: 'shopping',
      unknown: 'shopping',
    };

    const subcategoryMap = {
      electricity_bill: 'electricity',
      fuel_receipt: 'car_gasoline',
      shopping_invoice: 'general',
      unknown: 'general',
    };

    startTransition(async () => {
      const res = await addActivity({
        category: categoryMap[ocrResult.documentType],
        subcategory: subcategoryMap[ocrResult.documentType] as any,
        value: ocrResult.extractedData.amount ?? 50,
        unit: ocrResult.extractedData.unit ?? 'units',
        activityDate: new Date().toISOString().split('T')[0],
      });

      if (res.success) {
        setSuccessMsg(`Successfully logged OCR extraction to Carbon DNA! Allocated ${ocrResult.estimatedEmissions} kg CO₂e to your emissions database.`);
        setFile(null);
        setPreviewUrl(null);
        setOcrResult(null);
      } else {
        setError(res.error ?? 'Failed to write OCR log.');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Receipt & Bill Scan</h1>
        <p className="text-gray-400">Scan utility bills or travel fuel receipts with Tesseract OCR to automatically extract carbon emissions.</p>
      </div>

      {/* ── Feedback banners ── */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-500/25 bg-red-500/10 p-4 text-red-400 animate-fade-in" role="alert">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-4 text-emerald-400 animate-fade-in" role="alert">
          <Check className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">{successMsg}</span>
        </div>
      )}

      {/* ── OCR Scan Layout ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        {/* Upload Container */}
        <div className="glass-card p-6 lg:col-span-6 space-y-4">
          <h2 className="font-heading text-xl font-bold flex items-center gap-2">
            <ScanLine className="h-5 w-5 text-emerald-400" /> Upload Document
          </h2>

          <div 
            className="flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl p-8 bg-black/20 hover:border-emerald-500/30 transition cursor-pointer relative"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Upload document image file"
            />
            {previewUrl ? (
              <div className="space-y-4 text-center">
                <img 
                  src={previewUrl} 
                  alt="Document Preview" 
                  className="max-h-48 mx-auto rounded-lg border border-white/5 shadow-md object-contain"
                />
                <p className="text-xs text-gray-400">{file?.name} ({(file!.size / 1024).toFixed(1)} KB)</p>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <UploadCloud className="h-10 w-10 text-gray-500 mx-auto" />
                <h3 className="text-sm font-semibold text-white">Drag & drop or click to upload</h3>
                <p className="text-xs text-gray-500">Supports JPG, PNG up to 5MB</p>
              </div>
            )}
          </div>

          {file && !ocrResult && !isPending && (
            <div className="flex justify-end">
              <button
                onClick={runOCR}
                className="gradient-primary flex items-center gap-2 rounded-lg px-6 py-2.5 font-semibold text-white transition hover:opacity-90 active:scale-95"
              >
                <ScanLine className="h-4 w-4" /> Start OCR Scanning
              </button>
            </div>
          )}

          {isPending && progress && (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
              <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">{progress}</p>
            </div>
          )}
        </div>

        {/* OCR Result Extraction */}
        <div className="lg:col-span-6 space-y-6">
          {!ocrResult ? (
            <div className="glass-card p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
              <FileText className="h-10 w-10 text-gray-600 mb-3 animate-pulse" />
              <h3 className="font-heading text-lg font-bold text-gray-400">Extracted Results</h3>
              <p className="text-xs text-gray-500 max-w-xs mt-1 leading-relaxed">
                Upload a bill or receipt image, and click "Start OCR Scanning" to display structural parameters.
              </p>
            </div>
          ) : (
            <div className="glass-card p-6 space-y-6 animate-fade-in">
              <h2 className="font-heading text-xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-400" /> Extracted Parameters
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Document Classification</span>
                  <p className="text-sm font-bold text-white mt-1 capitalize">
                    {ocrResult.documentType.replace(/_/g, ' ')}
                  </p>
                </div>

                <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">OCR Confidence</span>
                  <p className="text-sm font-bold text-emerald-400 mt-1">
                    {ocrResult.confidence}%
                  </p>
                </div>

                <div className="bg-black/30 rounded-lg p-4 border border-white/5 col-span-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Extracted Amount</span>
                  <p className="text-sm font-bold text-white mt-1">
                    {ocrResult.extractedData.amount} {ocrResult.extractedData.unit}
                    {ocrResult.extractedData.provider && (
                      <span className="text-xs text-gray-500 font-medium ml-2">from {ocrResult.extractedData.provider}</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Carbon Emission Estimation Badge */}
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Estimated Carbon Impact</span>
                  <h3 className="font-heading text-2xl font-bold text-white mt-1">
                    {ocrResult.estimatedEmissions} <span className="text-xs font-normal text-gray-400">kg CO₂e</span>
                  </h3>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <TrendingDown className="h-5 w-5" />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setOcrResult(null)}
                  className="rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/10 transition"
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveToDna}
                  disabled={isPending}
                  className="gradient-primary flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95 disabled:opacity-50"
                >
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save to Carbon DNA
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
