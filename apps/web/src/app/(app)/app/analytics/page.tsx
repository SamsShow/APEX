'use client';

import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, BarChart3, AlertTriangle, TrendingUp } from 'lucide-react';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { SentimentAnalysisDashboard } from '@/components/ai/SentimentAnalysisDashboard';
import { AIRiskAssessmentDashboard } from '@/components/ai/AIRiskAssessmentDashboard';
import { AnomalyDetectionDashboard } from '@/components/ai/AnomalyDetectionDashboard';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-zinc-400 mt-2">
            Comprehensive trading performance metrics and AI-powered insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
            <Brain className="w-3 h-3 mr-1" />
            AI Enhanced
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-zinc-900/50 border border-zinc-700">
          <TabsTrigger value="overview" className="data-[state=active]:bg-zinc-800">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="sentiment" className="data-[state=active]:bg-zinc-800">
            <TrendingUp className="w-4 h-4 mr-2" />
            Sentiment AI
          </TabsTrigger>
          <TabsTrigger value="risk" className="data-[state=active]:bg-zinc-800">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Risk AI
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="data-[state=active]:bg-zinc-800">
            <Brain className="w-4 h-4 mr-2" />
            Anomalies
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-zinc-800">
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="sentiment" className="mt-6">
          <SentimentAnalysisDashboard />
        </TabsContent>

        <TabsContent value="risk" className="mt-6">
          <AIRiskAssessmentDashboard />
        </TabsContent>

        <TabsContent value="anomalies" className="mt-6">
          <AnomalyDetectionDashboard />
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
