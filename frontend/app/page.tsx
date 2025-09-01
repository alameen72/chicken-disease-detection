"use client"

import { Button } from "@/components/ui/button"
import { LogIn, UserPlus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
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
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                  <LogIn className="h-4 w-4 sm:hidden" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-xs sm:text-sm px-2 sm:px-3">
                  <UserPlus className="h-4 w-4 sm:hidden" />
                  <span className="hidden sm:inline">Get Started</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Protect Your Flock with <span className="text-green-600">AI Technology</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            Detect chicken diseases instantly using advanced AI. Get expert treatment recommendations and keep your
            poultry healthy with our mobile-first solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-sm sm:max-w-none mx-auto">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 px-6 sm:px-8 w-full sm:w-auto">
                Start Free Trial
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-6 sm:px-8 bg-transparent w-full sm:w-auto">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-2">Free</h3>
              <div className="text-center mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl font-bold">₦0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">5 scans per month</p>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <li className="flex items-center text-sm">
                  <span className="text-green-600 mr-2">✓</span>5 scans per month
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-600 mr-2">✓</span>
                  Basic disease detection
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-600 mr-2">✓</span>
                  Treatment recommendations
                </li>
              </ul>
              <Button variant="outline" className="w-full bg-transparent">
                Start Free
              </Button>
            </div>

            {/* Basic Plan */}
            <div className="bg-white rounded-lg shadow-sm border-2 border-green-500 p-6 sm:p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-2">Basic</h3>
              <div className="text-center mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl font-bold">₦5,000</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">50 scans per month</p>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <li className="flex items-center text-sm">
                  <span className="text-green-600 mr-2">✓</span>
                  50 scans per month
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-600 mr-2">✓</span>
                  Voice support
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-600 mr-2">✓</span>
                  Detailed analysis
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-600 mr-2">✓</span>
                  Email support
                </li>
              </ul>
              <Button className="w-full bg-gray-900 hover:bg-gray-800">Subscribe</Button>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-center mb-2">Premium</h3>
              <div className="text-center mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl font-bold">₦15,000</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Unlimited per month</p>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                <li className="flex items-center text-sm">
                  <span className="text-green-600 mr-2">✓</span>
                  Unlimited scans
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-600 mr-2">✓</span>
                  Voice support
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-600 mr-2">✓</span>
                  Export scan history
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-600 mr-2">✓</span>
                  Priority support
                </li>
                <li className="flex items-center text-sm">
                  <span className="text-green-600 mr-2">✓</span>
                  Advanced analytics
                </li>
              </ul>
              <Button variant="outline" className="w-full bg-transparent">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
            <Image
              src="/chicken-logo.png"
              alt="ChickenCare AI Logo"
              width={50}
              height={50}
              className="h-5 w-5 sm:h-6 sm:w-6 brightness-0 invert"
            />
            <span className="text-base sm:text-lg font-bold">ChickenCare AI</span>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">
            © 2024 ChickenCare AI. All rights reserved. Protecting poultry worldwide.
          </p>
        </div>
      </footer>
    </div>
  )
}
