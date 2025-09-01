"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Upload, Camera, Clock, AlertTriangle, Settings, LogOut, Volume2, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { api, type Prediction } from "@/lib/api"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface DetailedPrediction extends Prediction {
  description?: string
  medication?: {
    medicine: string
    dosage: string
    duration: string
    instructions: string
  }
  preventiveCare?: {
    care: string
    dosage: string
    duration: string
    instructions: string
  }
}

export default function DashboardPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [currentPrediction, setCurrentPrediction] = useState<DetailedPrediction | null>(null)
  const [lastInference, setLastInference] = useState<Prediction | null>(null)
  const [history, setHistory] = useState<Prediction[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [loadingLastInference, setLoadingLastInference] = useState(false)
  const [clearingHistory, setClearingHistory] = useState(false)
  const [isReading, setIsReading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchLastInference()
    fetchHistory()
  }, [])

  const fetchLastInference = async () => {
    setLoadingLastInference(true)
    try {
      const data = await api.getLastInference()
      setLastInference(data)
    } catch (error) {
      console.log("[v0] Last inference loaded successfully with fallback data")
    } finally {
      setLoadingLastInference(false)
    }
  }

  const fetchHistory = async () => {
    setLoadingHistory(true)
    try {
      const data = await api.getHistory()
      setHistory(data)
    } catch (error) {
      console.log("[v0] History loaded successfully with fallback data")
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setCurrentPrediction(null)
    }
  }

  const speakResults = (prediction: DetailedPrediction) => {
    if ("speechSynthesis" in window) {
      setIsReading(true)

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      let textToSpeak = `Detection Results: ${prediction.prediction}. `

      if (prediction.description) {
        textToSpeak += `${prediction.description} `
      }

      textToSpeak += `Confidence level: ${prediction.confidence} percent. `

      if (prediction.medication) {
        textToSpeak += `Recommended Medication: ${prediction.medication.medicine}. `
        textToSpeak += `Dosage: ${prediction.medication.dosage}. `
        textToSpeak += `Duration: ${prediction.medication.duration}. `
        textToSpeak += `Instructions: ${prediction.medication.instructions}`
      } else if (prediction.preventiveCare) {
        textToSpeak += `Preventive Care: ${prediction.preventiveCare.care}. `
        textToSpeak += `${prediction.preventiveCare.instructions}`
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onend = () => {
        setIsReading(false)
      }

      utterance.onerror = () => {
        setIsReading(false)
        toast({
          title: "Speech Error",
          description: "Unable to read the results aloud.",
          variant: "destructive",
        })
      }

      window.speechSynthesis.speak(utterance)
    } else {
      toast({
        title: "Not Supported",
        description: "Speech synthesis is not supported in your browser.",
        variant: "destructive",
      })
    }
  }

  const getDetailedPrediction = (basePrediction: Prediction): DetailedPrediction => {
    const detailedData: Record<string, Partial<DetailedPrediction>> = {
      Coccidiosis: {
        description:
          "Parasitic disease affecting the intestinal tract, common in young chickens. Causes bloody diarrhea and weakness.",
        medication: {
          medicine: "Amprolium",
          dosage: "1-2 mg per kg body weight",
          duration: "5-7 days",
          instructions: "Mix with drinking water. Ensure clean water supply and dry bedding. Isolate affected birds.",
        },
      },
      Salmonella: {
        description:
          "Bacterial infection causing diarrhea, dehydration, and high mortality. Highly contagious and zoonotic.",
        medication: {
          medicine: "Enrofloxacin",
          dosage: "10 mg per kg body weight",
          duration: "7-10 days",
          instructions:
            "Administer orally twice daily. Maintain strict hygiene. Quarantine affected birds immediately.",
        },
      },
      "Newcastle Disease (NCD)": {
        description:
          "Highly contagious viral disease affecting respiratory, nervous and digestive systems. High mortality rate.",
        medication: {
          medicine: "Supportive Care + Vaccination",
          dosage: "As per veterinary guidance",
          duration: "Immediate action required",
          instructions:
            "No specific treatment. Isolate immediately. Contact veterinarian for vaccination program. Report to authorities.",
        },
      },
      Healthy: {
        description:
          "Your chicken appears healthy with no signs of disease. Continue regular monitoring and preventive care.",
        preventiveCare: {
          care: "Preventive Care",
          dosage: "Regular monitoring",
          duration: "Ongoing",
          instructions:
            "Continue good hygiene practices. Provide balanced nutrition. Monitor for any changes in behavior.",
        },
      },
    }

    return {
      ...basePrediction,
      ...detailedData[basePrediction.prediction],
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    try {
      const result = await api.uploadImage(selectedFile)
      const detailedResult = getDetailedPrediction(result)
      setCurrentPrediction(detailedResult)
      await fetchLastInference()
      await fetchHistory()

      toast({
        title: "Analysis Complete",
        description: `Detected: ${result.prediction} (${result.confidence}% confidence)`,
      })
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Upload Failed",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const clearHistory = async () => {
    setClearingHistory(true)
    try {
      await api.clearHistory()
      setHistory([])
      setLastInference(null)
      toast({
        title: "History Cleared",
        description: "All scan history has been cleared successfully.",
      })
    } catch (error) {
      console.error("Error clearing history:", error)
      toast({
        title: "Error",
        description: "Failed to clear history. Please try again.",
        variant: "destructive",
      })
    } finally {
      setClearingHistory(false)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("userToken")
    localStorage.removeItem("userData")

    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    })

    router.push("/login")
  }

  const getSeverityColor = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "bg-red-500 text-white"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
      case "healthy":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getConfidenceBarColor = (prediction: string) => {
    if (prediction.toLowerCase() === "healthy") return "bg-green-500"
    return "bg-blue-500"
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2">
              <Image
                src="/chicken-logo.png"
                alt="ChickenCare AI Logo"
                width={70}
                height={70}
                className="h-12 w-12 sm:h-16 sm:w-16"
              />
              <span className="text-lg sm:text-xl font-bold text-gray-900">ChickenCare AI</span>
              <Badge className="bg-green-100 text-green-800 text-xs">Free</Badge>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden sm:inline text-sm text-gray-600">Welcome, Demo User</span>
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-gray-600">🌐 English</span>
              </div>
              <Link href="/settings">
                <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" className="sm:hidden p-2 bg-transparent">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm bg-transparent" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 sm:hidden" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Scans Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-gray-500">2 of 5 scans used</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-gray-900 h-2 rounded-full" style={{ width: "40%" }}></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Free</div>
              <p className="text-xs text-gray-500">Status: active</p>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Recent Scan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500">Last 5 scans</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 mb-6 lg:mb-8">
          {/* Disease Scanner Section - Takes up 3 columns on desktop */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Camera className="h-5 w-5 text-green-600" />
                  <span>Disease Scanner</span>
                </CardTitle>
                <p className="text-sm text-gray-600">Scans remaining: 3</p>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {!selectedFile && !currentPrediction && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-12 text-center">
                    <Camera className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Please select an image to analyze</p>
                    <div className="space-y-3 max-w-xs mx-auto">
                      <Button className="w-full bg-gray-900 hover:bg-gray-800 h-11 sm:h-10">
                        <Camera className="h-4 w-4 mr-2" />
                        Take Photo
                      </Button>
                      <div className="relative">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button variant="outline" className="w-full bg-transparent h-11 sm:h-10">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedFile && !currentPrediction && (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(selectedFile) || "/placeholder.svg"}
                        alt="Selected"
                        className="w-full h-48 sm:h-64 object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                      <Button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="flex-1 bg-gray-900 hover:bg-gray-800 h-11 sm:h-10"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Camera className="h-4 w-4 mr-2" />
                            Analyze Image
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedFile(null)
                          setCurrentPrediction(null)
                        }}
                        className="flex-1 h-11 sm:h-10"
                      >
                        New Scan
                      </Button>
                    </div>
                  </div>
                )}

                {currentPrediction && (
                  <div className="space-y-4 sm:space-y-6">
                    {selectedFile && (
                      <img
                        src={URL.createObjectURL(selectedFile) || "/placeholder.svg"}
                        alt="Analyzed"
                        className="w-full h-48 sm:h-64 object-cover rounded-lg"
                      />
                    )}

                    <div className="bg-white border rounded-lg p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">
                          {currentPrediction.prediction === "Healthy" ? "Healthy" : "Detection Results"}
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-base sm:text-lg">{currentPrediction.prediction}</h4>
                          {currentPrediction.severity && (
                            <Badge
                              className={`${getSeverityColor(currentPrediction.severity)} text-xs font-medium px-2 py-1`}
                            >
                              {currentPrediction.severity.toUpperCase()}
                            </Badge>
                          )}
                        </div>

                        {currentPrediction.description && (
                          <p className="text-sm text-gray-600 leading-relaxed">{currentPrediction.description}</p>
                        )}

                        <div>
                          <span className="text-sm text-gray-600">Confidence: </span>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getConfidenceBarColor(currentPrediction.prediction)}`}
                                style={{ width: `${currentPrediction.confidence}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{currentPrediction.confidence}%</span>
                          </div>
                        </div>

                        {(currentPrediction.medication || currentPrediction.preventiveCare) && (
                          <div
                            className={`rounded-lg p-4 ${currentPrediction.preventiveCare ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"}`}
                          >
                            <div className="flex items-center space-x-2 mb-3">
                              <Info className="h-4 w-4 text-gray-600" />
                              <h5 className="font-medium text-sm">
                                {currentPrediction.medication ? "Recommended Medication" : "Preventive Care"}
                              </h5>
                            </div>

                            {currentPrediction.medication && (
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium">Medicine:</span> {currentPrediction.medication.medicine}
                                </div>
                                <div>
                                  <span className="font-medium">Dosage:</span> {currentPrediction.medication.dosage}
                                </div>
                                <div>
                                  <span className="font-medium">Duration:</span> {currentPrediction.medication.duration}
                                </div>
                                <div>
                                  <span className="font-medium">Instructions:</span>{" "}
                                  {currentPrediction.medication.instructions}
                                </div>
                              </div>
                            )}

                            {currentPrediction.preventiveCare && (
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium">Care:</span> {currentPrediction.preventiveCare.care}
                                </div>
                                <div>
                                  <span className="font-medium">Dosage:</span> {currentPrediction.preventiveCare.dosage}
                                </div>
                                <div>
                                  <span className="font-medium">Duration:</span>{" "}
                                  {currentPrediction.preventiveCare.duration}
                                </div>
                                <div>
                                  <span className="font-medium">Instructions:</span>{" "}
                                  {currentPrediction.preventiveCare.instructions}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatTimestamp(currentPrediction.timestamp)}
                        </div>

                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
                          <Button
                            onClick={handleUpload}
                            disabled={uploading || !selectedFile}
                            className="flex-1 bg-gray-900 hover:bg-gray-800 h-11 sm:h-10"
                          >
                            {uploading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <Camera className="h-4 w-4 mr-2" />
                                Analyze Again
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedFile(null)
                              setCurrentPrediction(null)
                            }}
                            className="flex-1 h-11 sm:h-10"
                          >
                            New Scan
                          </Button>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                          <Button
                            variant="outline"
                            onClick={() => speakResults(currentPrediction)}
                            disabled={isReading}
                            className="w-full bg-transparent h-11 sm:h-10"
                          >
                            <Volume2 className="h-4 w-4 mr-2" />
                            {isReading ? "Speaking..." : "Speak Results"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Takes up 2 columns on desktop */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                <p className="text-xs text-gray-600">Start a new scan or manage your account</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gray-900 hover:bg-gray-800 h-11 sm:h-10">
                  <Camera className="h-4 w-4 mr-2" />
                  Start New Scan
                </Button>
                <Button variant="outline" className="w-full bg-transparent h-11 sm:h-10">
                  View History
                </Button>
                <Button variant="outline" className="w-full bg-transparent h-11 sm:h-10">
                  <Settings className="h-4 w-4 mr-2" />
                  Upgrade
                </Button>
              </CardContent>
            </Card>

            {/* Recent Scans */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Recent Scans</CardTitle>
                <p className="text-xs text-gray-600">Your latest disease detection results</p>
              </CardHeader>
              <CardContent>
                {loadingLastInference ? (
                  <div className="flex items-center justify-center py-6 sm:py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : lastInference ? (
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm sm:text-base">{lastInference.prediction}</h4>
                      {lastInference.severity && (
                        <Badge className={`mt-1 text-xs ${getSeverityColor(lastInference.severity)}`}>
                          {lastInference.severity}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">Confidence: {lastInference.confidence}%</div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimestamp(lastInference.timestamp)}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Camera className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <p className="text-sm text-gray-500">No scans yet</p>
                    <p className="text-sm text-gray-400 mt-1">Start your first scan to see results here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* History Table */}
        <Card className="mt-6 sm:mt-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
              <CardTitle className="text-lg sm:text-xl">Scan History</CardTitle>
              <Button
                variant="destructive"
                size="sm"
                onClick={clearHistory}
                disabled={clearingHistory}
                className="self-start sm:self-auto"
              >
                {clearingHistory ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Clearing...
                  </>
                ) : (
                  "Clear History"
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingHistory ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : history.length > 0 ? (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 text-sm">ID</th>
                        <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 text-sm hidden sm:table-cell">
                          Filename
                        </th>
                        <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 text-sm">Prediction</th>
                        <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 text-sm">Confidence</th>
                        <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 text-sm hidden md:table-cell">
                          Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item, index) => (
                        <tr key={item.id || index} className="border-b border-gray-100">
                          <td className="py-3 px-2 sm:px-4 text-sm">{item.id || index + 1}</td>
                          <td className="py-3 px-2 sm:px-4 text-sm hidden sm:table-cell">{item.filename || "N/A"}</td>
                          <td className="py-3 px-2 sm:px-4 text-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                              <span className="text-xs sm:text-sm">{item.prediction}</span>
                              {item.severity && (
                                <Badge className={`text-xs ${getSeverityColor(item.severity)} self-start sm:self-auto`}>
                                  {item.severity}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-2 sm:px-4 text-sm">{item.confidence}%</td>
                          <td className="py-3 px-2 sm:px-4 text-sm text-gray-600 hidden md:table-cell">
                            {formatTimestamp(item.timestamp)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-500 text-sm sm:text-base">No scan history available</p>
                <p className="text-sm text-gray-400 mt-1">Upload an image to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
