"use client";

import { ArrowLeft } from "lucide-react";

const GoBackButton = () => {
  return (
    <button
      onClick={() => window.history.back()}
      className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Go back to previous page
    </button>
  );
};

export default GoBackButton;