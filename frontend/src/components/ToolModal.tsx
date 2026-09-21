import React, { useState, useRef } from 'react';
import type { ToolItem } from '../types/tool';
import confetti from 'canvas-confetti';
import axios from 'axios';
import {
  X, UploadCloud, File, Trash2, ArrowUp, ArrowDown,
  CheckCircle2, AlertCircle, Loader2, Download, Settings2,
  Lock, Eye, EyeOff, Sparkles, RefreshCw
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
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.35);
  const [watermarkAngle, setWatermarkAngle] = useState(45);
  const [watermarkColor, setWatermarkColor] = useState('#EF4444');
  const [watermarkFontSize, setWatermarkFontSize] = useState(40);
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
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setErrorMsg('Please select at least one file to convert.');
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
    setProgressStatus('Uploading & Processing document...');
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

      // Append specific parameters
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
            setProgressStatus(`Uploading file (${percent}%)...`);
          } else {
            setProgressStatus('Running high-fidelity conversion engine...');
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
      triggerConfetti();
    } catch (err: any) {
      if (err.response && err.response.data instanceof Blob) {
        const text = await err.response.data.text();
        try {
          const json = JSON.parse(text);
          setErrorMsg(json.detail || 'An error occurred during conversion.');
        } catch {
          setErrorMsg(text || 'An error occurred during conversion.');
        }
      } else {
        setErrorMsg(err.message || 'Conversion failed. Please try again.');
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 transition-all">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {tool.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {tool.desc}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {downloadUrl ? (
            <div className="text-center py-8 px-4 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Conversion Complete!
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Your file is ready for download ({resultFileSize})
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={downloadUrl}
                  download={downloadFilename}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-xl shadow-rose-500/25 hover:scale-102 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {downloadFilename}</span>
                </a>
                <button
                  onClick={resetAll}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Convert Another File</span>
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
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 scale-[0.99]'
                    : 'border-slate-300 dark:border-slate-700 hover:border-rose-400 bg-slate-50/60 dark:bg-slate-900/40'
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
                <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/80 text-rose-500 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-base">
                  {isDragging ? 'Drop your files right here' : 'Click to select or drag & drop files here'}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Supported formats: <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{tool.inputExt}</span>
                  {tool.acceptMultiple && ' • Multiple files supported'}
                </p>
              </div>

              {/* UPLOADED FILE LIST */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
                    <span>Selected Files ({files.length})</span>
                    <button
                      onClick={resetAll}
                      className="text-rose-500 hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {files.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs"
                      >
                        <div className="flex items-center space-x-2.5 overflow-hidden">
                          <File className="w-4 h-4 text-rose-500 shrink-0" />
                          <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                            {file.name}
                          </span>
                          <span className="text-slate-400 shrink-0">
                            ({formatBytes(file.size)})
                          </span>
                        </div>

                        <div className="flex items-center space-x-1 shrink-0 ml-2">
                          {tool.acceptMultiple && (
                            <>
                              <button
                                disabled={idx === 0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveFile(idx, 'up');
                                }}
                                className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                disabled={idx === files.length - 1}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveFile(idx, 'down');
                                }}
                                className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(idx);
                            }}
                            className="p-1 text-rose-400 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TOOL SPECIFIC OPTIONS ACCORDION/PANEL */}
              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  <Settings2 className="w-4 h-4 text-rose-500" />
                  <span>Conversion Settings</span>
                </div>

                {tool.id === 'split-pdf' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Page Ranges (optional, e.g. &quot;1-3, 5, 7-9&quot; or leave blank to split every page)
                    </label>
                    <input
                      type="text"
                      value={splitRange}
                      onChange={(e) => setSplitRange(e.target.value)}
                      placeholder="e.g. 1-2, 4-6"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                )}

                {tool.id === 'compress-pdf' && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Compression Level
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'medium', label: 'Recommended', desc: 'Good quality, good compression' },
                        { id: 'high', label: 'Extreme', desc: 'Less quality, high compression' }
                      ].map((lvl) => (
                        <button
                          key={lvl.id}
                          type="button"
                          onClick={() => setCompressLevel(lvl.id)}
                          className={`p-2.5 text-left rounded-xl border text-xs transition-all cursor-pointer ${
                            compressLevel === lvl.id
                              ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 font-bold'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <div className="font-bold">{lvl.label}</div>
                          <div className="text-[10px] opacity-75">{lvl.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {tool.id === 'watermark-pdf' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Watermark Text
                      </label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="CONFIDENTIAL"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Font Size ({watermarkFontSize}px)
                      </label>
                      <input
                        type="number"
                        min="12"
                        max="96"
                        value={watermarkFontSize}
                        onChange={(e) => setWatermarkFontSize(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Rotation Angle ({watermarkAngle}°)
                      </label>
                      <select
                        value={watermarkAngle}
                        onChange={(e) => setWatermarkAngle(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer"
                      >
                        <option value={0}>0° (Horizontal)</option>
                        <option value={45}>45° (Diagonal)</option>
                        <option value={90}>90° (Vertical)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Opacity ({Math.round(watermarkOpacity * 100)}%)
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="0.9"
                        step="0.05"
                        value={watermarkOpacity}
                        onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={watermarkColor}
                          onChange={(e) => setWatermarkColor(e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                        />
                        <span className="text-xs font-mono text-slate-500">{watermarkColor}</span>
                      </div>
                    </div>
                  </div>
                )}

                {(tool.id === 'protect-pdf' || tool.id === 'unlock-pdf') && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                      <Lock className="w-3.5 h-3.5 text-rose-500" />
                      <span>{tool.id === 'protect-pdf' ? 'Set Document Password' : 'Enter Password to Decrypt'}</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password..."
                        className="w-full pl-3 pr-10 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-rose-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {tool.id === 'rotate-pdf' && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Rotate Clockwise
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[90, 180, 270].map((deg) => (
                        <button
                          key={deg}
                          type="button"
                          onClick={() => setRotateAngle(deg)}
                          className={`py-2 text-center rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            rotateAngle === deg
                              ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600'
                          }`}
                        >
                          +{deg}°
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {tool.id === 'pdf-to-images' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Image Format
                      </label>
                      <select
                        value={imageFormat}
                        onChange={(e) => setImageFormat(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer"
                      >
                        <option value="png">PNG (Lossless)</option>
                        <option value="jpeg">JPG (Standard)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Resolution (DPI)
                      </label>
                      <select
                        value={imageDpi}
                        onChange={(e) => setImageDpi(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer"
                      >
                        <option value={72}>72 DPI (Web/Low)</option>
                        <option value={150}>150 DPI (Standard)</option>
                        <option value={300}>300 DPI (High Print)</option>
                      </select>
                    </div>
                  </div>
                )}

                {!['split-pdf', 'compress-pdf', 'watermark-pdf', 'protect-pdf', 'unlock-pdf', 'rotate-pdf', 'pdf-to-images'].includes(tool.id) && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    High fidelity rendering enabled. Layouts, typography, images, and tables will be converted automatically.
                  </p>
                )}
              </div>

              {/* Error Banner */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-start space-x-2.5 text-rose-600 dark:text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Conversion Error</div>
                    <div>{errorMsg}</div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                disabled={files.length === 0 || isProcessing}
                onClick={handleConvert}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-sm shadow-xl shadow-rose-500/25 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{progressStatus}</span>
                  </>
                ) : (
                  <>
                    <span>Start {tool.title}</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
