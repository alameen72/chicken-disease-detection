"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, User, CreditCard, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SettingsPage() {
  const [fullName, setFullName] = useState("Demo User")
  const [email, setEmail] = useState("demo@example.com")
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle profile update
    console.log("Profile updated")
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmation === "DELETE") {
      // Handle account deletion
      console.log("Account deleted")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                  <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Image
                  src="/chicken-logo.png"
                  alt="ChickenCare AI Logo"
                  width={50}
                  height={50}
                  className="h-6 w-6 sm:h-8 sm:w-8"
                />
                <span className="text-lg sm:text-xl font-bold text-gray-900">ChickenCare AI</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage your account and preferences</p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Profile Information */}
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Profile Information</span>
              </CardTitle>
              <p className="text-sm text-gray-600">Update your personal information and contact details</p>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <form onSubmit={handleUpdateProfile} className="space-y-4 sm:space-y-6">
                <div>
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 h-11 sm:h-10"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 h-11 sm:h-10"
                  />
                </div>

                <Button type="submit" className="bg-gray-900 hover:bg-gray-800 h-11 sm:h-10 w-full sm:w-auto">
                  Update Profile
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Subscription</span>
              </CardTitle>
              <p className="text-sm text-gray-600">Manage your subscription and billing</p>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                <div>
                  <h3 className="font-medium text-base sm:text-lg">Free Plan</h3>
                  <p className="text-sm text-gray-600">2 of 5 scans used</p>
                </div>
                <Button variant="outline" className="h-11 sm:h-10 w-full sm:w-auto bg-transparent">
                  Manage Plan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center space-x-2 text-red-600 text-lg sm:text-xl">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Danger Zone</span>
              </CardTitle>
              <p className="text-sm text-gray-600">Irreversible actions that will permanently affect your account</p>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4">
                <p className="text-sm text-red-800 leading-relaxed">
                  Deleting your account will permanently remove all your data, including scan history and settings. This
                  action cannot be undone.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="deleteConfirmation" className="text-sm font-medium text-gray-700">
                    Type "DELETE" to confirm account deletion
                  </Label>
                  <Input
                    id="deleteConfirmation"
                    type="text"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="Type DELETE to confirm"
                    className="mt-1 h-11 sm:h-10"
                  />
                </div>

                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmation !== "DELETE"}
                  className="h-11 sm:h-10 w-full sm:w-auto"
                >
                  Delete Account Permanently
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
