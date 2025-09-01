"use client"

import Image from "next/image"

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center">
        <div className="mb-6 animate-pulse">
          <Image
            src="/chicken-logo.png"
            alt="ChickenCare AI Logo"
            width={120}
            height={120}
            className="mx-auto h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 animate-fade-in">Chicken-Care AI</h1>

        <div className="mt-8 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    </div>
  )
}
