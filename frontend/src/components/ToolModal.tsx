import React, { useState, useRef } from 'react';
import type { ToolItem } from '../types/tool';
import axios from 'axios';
import {
  X, UploadCloud, File, Trash2, ArrowUp, ArrowDown,
  Check, AlertCircle, Loader2, Download,
  Lock, Eye, EyeOff, RotateCcw
} from 'lucide-react';

interface ToolModalProps {
  tool: ToolItem | null;
  onClose: () => void;
}

export const ToolModal: React.FC<ToolModalProps> = ({ tool, onClose }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string>('');
  const [resultFileSize, setResultFileSize] = useState<string>('');

  // Tool specific options
  const [splitRange, setSplitRange] = useState('');
  const [compressLevel, setCompressLevel] = useState('medium');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [watermarkAngle, setWatermarkAngle] = useState(45);
  const [watermarkColor, setWatermarkColor] = useState('#64748B');
  const [watermarkFontSize, setWatermarkFontSize] = useState(36);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rotateAngle, setRotateAngle] = useState(90);
  const [imageFormat, setImageFormat] = useState('png');
  const [imageDpi, setImageDpi] = useState(150);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!tool) return null;

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles || newFiles.length === 0) return;
    setErrorMsg(null);
    setDownloadUrl(null);

    const fileArray = Array.from(newFiles);
    if (tool.acceptMultiple) {
      setFiles((prev) => [...prev, ...fileArray]);
    } else {
      setFiles([fileArray[0]]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= files.length) return;
    const updated = [...files];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIdx, 0, moved);
    setFiles(updated);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setErrorMsg('Please select a file to convert.');
      return;
    }

    if (tool.id === 'merge-pdf' && files.length < 2) {
      setErrorMsg('Please upload at least 2 PDF files to merge.');
      return;
    }

    if ((tool.id === 'protect-pdf' || tool.id === 'unlock-pdf') && !password) {
      setErrorMsg('Please enter a password.');
      return;
    }

    setIsProcessing(true);
    setProgressStatus('Processing document...');
    setErrorMsg(null);

    try {
      const formData = new FormData();

      if (tool.acceptMultiple) {
        files.forEach((f) => {
          formData.append('files', f);
        });
      } else {
        formData.append('file', files[0]);
      }

      if (tool.id === 'split-pdf' && splitRange.trim()) {
        formData.append('ranges', splitRange.trim());
      } else if (tool.id === 'compress-pdf') {
        formData.append('level', compressLevel);
      } else if (tool.id === 'watermark-pdf') {
        formData.append('text', watermarkText);
        formData.append('opacity', String(watermarkOpacity));
        formData.append('angle', String(watermarkAngle));
        formData.append('font_size', String(watermarkFontSize));
        formData.append('color', watermarkColor);
      } else if (tool.id === 'protect-pdf' || tool.id === 'unlock-pdf') {
        formData.append('password', password);
      } else if (tool.id === 'rotate-pdf') {
        formData.append('angle', String(rotateAngle));
      } else if (tool.id === 'pdf-to-images') {
        formData.append('fmt', imageFormat);
        formData.append('dpi', String(imageDpi));
      }

      const response = await axios.post(tool.endpoint, formData, {
        responseType: 'blob',
        onUploadProgress: (progressEvent) => {
          const percent = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 50;
          if (percent < 100) {
            setProgressStatus(`Uploading (${percent}%)...`);
          } else {
            setProgressStatus('Processing...');
          }
        },
      });

      const contentDisposition = response.headers['content-disposition'];
      let filename = `converted_${tool.id}${tool.outputExt}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      } else {
        const baseName = files[0].name.replace(/\.[^/.]+$/, '');
        filename = `${baseName}_converted${tool.outputExt}`;
      }

      const blob = new Blob([response.data]);
      const blobUrl = window.URL.createObjectURL(blob);
      setDownloadUrl(blobUrl);
      setDownloadFilename(filename);
      setResultFileSize(formatBytes(blob.size));
    } catch (err: any) {
      if (err.response && err.response.data instanceof Blob) {
        const text = await err.response.data.text();
        try {
          const json = JSON.parse(text);
          setErrorMsg(json.detail || 'An error occurred during processing.');
        } catch {
          setErrorMsg(text || 'An error occurred during processing.');
        }
      } else {
        setErrorMsg(err.message || 'Processing failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setFiles([]);
    setDownloadUrl(null);
    setErrorMsg(null);
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 transition-all">
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Bar */}
        <div className="px-6 py-4.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
              {tool.title}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
              {tool.desc}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* SUCCESS STATE */}
          {downloadUrl ? (
            <div className="text-center py-6 px-2 space-y-4">
              <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  File Ready
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {downloadFilename} • {resultFileSize}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                <a
                  href={downloadUrl}
                  download={downloadFilename}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 font-medium text-xs shadow-xs transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File</span>
                </a>
                <button
                  onClick={resetAll}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-xs transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Convert Another</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* DRAG & DROP UPLOAD ZONE */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFiles(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border border-dashed rounded-xl p-7 text-center cursor-pointer transition-all duration-150 ${
                  isDragging
                    ? 'border-zinc-900 dark:border-white bg-zinc-100/50 dark:bg-zinc-800/50'
                    : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 bg-zinc-50/50 dark:bg-zinc-900/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple={tool.acceptMultiple}
                  accept={tool.inputExt}
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 flex items-center justify-center mx-auto mb-2.5">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="font-medium text-zinc-800 dark:text-zinc-200 text-xs">
                  {isDragging ? 'Drop file to upload' : 'Click to select or drag and drop file'}
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Supports <span className="font-mono">{tool.inputExt}</span>
                  {tool.acceptMultiple && ' • Multiple files supported'}
                </p>
              </div>

              {/* SELECTED FILES LIST */}
              {files.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-medium text-zinc-500 px-0.5">
                    <span>Selected files ({files.length})</span>
                    <button
                      onClick={resetAll}
                      className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-1 pr-0.5">
                    {files.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-800 text-xs"
                      >
                        <div className="flex items-center space-x-2 overflow-hidden">
                          <File className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate">
                            {file.name}
                          </span>
                          <span className="text-zinc-400 shrink-0 text-[11px]">
                            ({formatBytes(file.size)})
                          </span>
                        </div>

                        <div className="flex items-center space-x-0.5 shrink-0 ml-2">
                          {tool.acceptMultiple && (
                            <>
                              <button
                                disabled={idx === 0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveFile(idx, 'up');
                                }}
                                className="p-1 text-zinc-400 hover:text-zinc-600 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                disabled={idx === files.length - 1}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveFile(idx, 'down');
                                }}
                                className="p-1 text-zinc-400 hover:text-zinc-600 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(idx);
                            }}
                            className="p-1 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TOOL SPECIFIC OPTIONS */}
              {['split-pdf', 'compress-pdf', 'watermark-pdf', 'protect-pdf', 'unlock-pdf', 'rotate-pdf', 'pdf-to-images'].includes(tool.id) && (
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-800 space-y-3">
                  
                  {/* Split PDF */}
                  {tool.id === 'split-pdf' && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        Page Ranges (optional, e.g. 1-3, 5, 7-9 or leave blank to split every page)
                      </label>
                      <input
                        type="text"
                        value={splitRange}
                        onChange={(e) => setSplitRange(e.target.value)}
                        placeholder="e.g. 1-2, 4-6"
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                      />
                    </div>
                  )}

                  {/* Compress PDF */}
                  {tool.id === 'compress-pdf' && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        Compression Level
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'medium', label: 'Balanced', desc: 'Standard compression' },
                          { id: 'high', label: 'High', desc: 'Maximum size reduction' }
                        ].map((lvl) => (
                          <button
                            key={lvl.id}
                            type="button"
                            onClick={() => setCompressLevel(lvl.id)}
                            className={`p-2 text-left rounded-lg border text-xs transition-all cursor-pointer ${
                              compressLevel === lvl.id
                                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900 font-medium'
                                : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                            }`}
                          >
                            <div>{lvl.label}</div>
                            <div className="text-[10px] opacity-70">{lvl.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Watermark PDF */}
                  {tool.id === 'watermark-pdf' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          Watermark Text
                        </label>
                        <input
                          type="text"
                          value={watermarkText}
                          onChange={(e) => setWatermarkText(e.target.value)}
                          placeholder="CONFIDENTIAL"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          Font Size ({watermarkFontSize}px)
                        </label>
                        <input
                          type="number"
                          min="12"
                          max="96"
                          value={watermarkFontSize}
                          onChange={(e) => setWatermarkFontSize(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          Rotation ({watermarkAngle}°)
                        </label>
                        <select
                          value={watermarkAngle}
                          onChange={(e) => setWatermarkAngle(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                        >
                          <option value={0}>Horizontal (0°)</option>
                          <option value={45}>Diagonal (45°)</option>
                          <option value={90}>Vertical (90°)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          Opacity ({Math.round(watermarkOpacity * 100)}%)
                        </label>
                        <input
                          type="range"
                          min="0.1"
                          max="0.9"
                          step="0.05"
                          value={watermarkOpacity}
                          onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                          className="w-full accent-zinc-900 dark:accent-white cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          Color
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={watermarkColor}
                            onChange={(e) => setWatermarkColor(e.target.value)}
                            className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                          />
                          <span className="text-xs font-mono text-zinc-500">{watermarkColor}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Password Protect / Unlock */}
                  {(tool.id === 'protect-pdf' || tool.id === 'unlock-pdf') && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-center space-x-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>{tool.id === 'protect-pdf' ? 'Set Password' : 'Enter Password to Decrypt'}</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password..."
                          className="w-full pl-3 pr-9 py-1.5 text-xs rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Rotate PDF */}
                  {tool.id === 'rotate-pdf' && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        Clockwise Rotation
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[90, 180, 270].map((deg) => (
                          <button
                            key={deg}
                            type="button"
                            onClick={() => setRotateAngle(deg)}
                            className={`py-1.5 text-center rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                              rotateAngle === deg
                                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900'
                                : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600'
                            }`}
                          >
                            +{deg}°
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PDF to Images */}
                  {tool.id === 'pdf-to-images' && (
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          Format
                        </label>
                        <select
                          value={imageFormat}
                          onChange={(e) => setImageFormat(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                        >
                          <option value="png">PNG (Lossless)</option>
                          <option value="jpeg">JPG</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          Resolution (DPI)
                        </label>
                        <select
                          value={imageDpi}
                          onChange={(e) => setImageDpi(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 cursor-pointer"
                        >
                          <option value={150}>150 DPI (Standard)</option>
                          <option value={300}>300 DPI (High Resolution)</option>
                          <option value={72}>72 DPI (Web)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Error Banner */}
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start space-x-2 text-red-600 dark:text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>{errorMsg}</div>
                </div>
              )}

              {/* Action Button */}
              <button
                disabled={files.length === 0 || isProcessing}
                onClick={handleConvert}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 disabled:opacity-40 disabled:pointer-events-none text-white font-medium text-xs shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{progressStatus}</span>
                  </>
                ) : (
                  <span>Convert & Process</span>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
