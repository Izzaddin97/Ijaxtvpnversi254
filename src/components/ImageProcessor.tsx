import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { 
  Upload, 
  Download, 
  Image as ImageIcon, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Scissors,
  Sparkles,
  Eye,
  RotateCcw
} from "lucide-react";
import { processImageFile } from "../utils/api-client";
import { toast } from "sonner@2.0.3";
import exampleImage from 'figma:asset/4d602f20b9827b134516fd65ad064329551a34c9.png';

export function ImageProcessor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalImageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      toast.error('Invalid file type. Please select an image.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size too large. Maximum 10MB allowed.');
      toast.error('File too large. Please select an image under 10MB.');
      return;
    }

    setSelectedFile(file);
    setProcessedImageUrl(null);
    setError(null);
    setProgress(0);
    toast.success('Image selected successfully!');
  };

  const processImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setProcessingStep('Uploading image...');

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 90) return prev + 10;
          return prev;
        });
      }, 200);

      setProcessingStep('Removing background...');
      
      const result = await processImageFile(selectedFile);
      
      clearInterval(progressInterval);
      setProgress(100);

      if (result.success && result.downloadUrl) {
        setProcessedImageUrl(result.downloadUrl);
        setProcessingStep('Processing complete!');
        toast.success('🎉 Background removed successfully!');
      } else {
        throw new Error(result.error || 'Processing failed');
      }
    } catch (err: any) {
      setError(err.message);
      setProcessingStep('Processing failed');
      toast.error('Failed to process image: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadProcessedImage = () => {
    if (!processedImageUrl) return;

    const link = document.createElement('a');
    link.href = processedImageUrl;
    link.download = `processed-${selectedFile?.name || 'image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Download started!');
  };

  const resetProcessor = () => {
    setSelectedFile(null);
    setProcessedImageUrl(null);
    setError(null);
    setProgress(0);
    setProcessingStep('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-green-500/50 text-green-400">
            <Scissors className="mr-2 h-4 w-4" />
            Image Processing
          </Badge>
          <h2 className="text-4xl alfa-slab-one-regular fire-text mb-4">
            Background Removal Tool
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your images into professional icons with our AI-powered background removal technology
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="fire-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Upload className="h-5 w-5" />
                Upload Image
              </CardTitle>
              <CardDescription>
                Select an image to remove its background and convert to icon format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Input */}
              <div 
                className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center cursor-pointer hover:border-green-500/50 transition-colors"
                onClick={triggerFileSelect}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-green-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">Click to select an image</p>
                    <p className="text-sm text-muted-foreground">
                      Supports PNG, JPG, JPEG up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Example Image */}
              <div className="border border-border/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-3">Example image:</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={exampleImage} 
                    alt="Example"
                    className="w-16 h-16 rounded-lg object-cover border border-green-500/30"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Create a file from the example image for demo
                      fetch(exampleImage)
                        .then(res => res.blob())
                        .then(blob => {
                          const file = new File([blob], 'example-logo.png', { type: 'image/png' });
                          setSelectedFile(file);
                          setError(null);
                          toast.success('Example image loaded!');
                        })
                        .catch(() => {
                          toast.error('Failed to load example image');
                        });
                    }}
                    className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Use Example
                  </Button>
                </div>
              </div>

              {/* Selected File Info */}
              {selectedFile && (
                <div className="bg-muted/30 rounded-lg p-4 border border-green-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-green-400">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetProcessor}
                      className="text-muted-foreground hover:text-red-400"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Process Button */}
              <Button
                onClick={processImage}
                disabled={!selectedFile || isProcessing}
                className="w-full bg-green-600 hover:bg-green-500 text-black"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Remove Background
                  </>
                )}
              </Button>

              {/* Progress */}
              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{processingStep}</span>
                    <span className="text-green-400">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Error */}
              {error && (
                <Alert className="border-red-500/50 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Result Section */}
          <Card className="fire-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Download className="h-5 w-5" />
                Processed Result
              </CardTitle>
              <CardDescription>
                Your image with background removed and optimized for icon use
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Before/After Comparison */}
              {selectedFile && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Original */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Original</p>
                      <div className="border border-border/30 rounded-lg p-4 bg-muted/20">
                        <img
                          ref={originalImageRef}
                          src={URL.createObjectURL(selectedFile)}
                          alt="Original"
                          className="w-full h-32 object-contain rounded"
                        />
                      </div>
                    </div>

                    {/* Processed */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Processed</p>
                      <div className="border border-border/30 rounded-lg p-4 bg-muted/20 relative">
                        {processedImageUrl ? (
                          <img
                            src={processedImageUrl}
                            alt="Processed"
                            className="w-full h-32 object-contain rounded"
                          />
                        ) : (
                          <div className="w-full h-32 flex items-center justify-center text-muted-foreground">
                            {isProcessing ? (
                              <Loader2 className="h-8 w-8 animate-spin text-green-400" />
                            ) : (
                              <ImageIcon className="h-8 w-8" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Success State */}
              {processedImageUrl && (
                <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span className="font-medium text-green-400">Processing Complete!</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your image has been successfully processed and is ready for download.
                  </p>
                  <Button
                    onClick={downloadProcessedImage}
                    className="w-full bg-green-600 hover:bg-green-500 text-black"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Processed Image
                  </Button>
                </div>
              )}

              {/* Empty State */}
              {!selectedFile && !isProcessing && (
                <div className="text-center py-12 border border-dashed border-border/30 rounded-lg">
                  <div className="mx-auto w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                    <Download className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Upload an image to see the processed result here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="fire-card text-center">
            <CardContent className="pt-6">
              <div className="mx-auto w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mb-4">
                <Scissors className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="font-semibold mb-2 text-green-400">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">
                Advanced algorithms for precise background removal
              </p>
            </CardContent>
          </Card>

          <Card className="fire-card text-center">
            <CardContent className="pt-6">
              <div className="mx-auto w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="font-semibold mb-2 text-green-400">Icon Ready</h3>
              <p className="text-sm text-muted-foreground">
                Optimized for icon use with transparent background
              </p>
            </CardContent>
          </Card>

          <Card className="fire-card text-center">
            <CardContent className="pt-6">
              <div className="mx-auto w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="font-semibold mb-2 text-green-400">High Quality</h3>
              <p className="text-sm text-muted-foreground">
                Maintains image quality while removing background
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
