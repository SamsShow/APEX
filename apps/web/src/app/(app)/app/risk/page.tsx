'use client';

import React from 'react';
import { RiskManagementDashboard } from '@/components/risk/RiskManagementDashboard';

export default function RiskPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Risk Management</h1>
        <p className="text-zinc-400 mt-2">
          Monitor portfolio risk, margin requirements, and stress test scenarios
        </p>
      </div>

      <RiskManagementDashboard />
    </div>
  );
}
