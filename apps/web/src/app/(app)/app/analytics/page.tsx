'use client';

import React from 'react';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-zinc-400 mt-2">Comprehensive trading performance metrics and insights</p>
      </div>

      <AnalyticsDashboard />
    </div>
  );
}
