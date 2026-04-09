"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";
import { generatePropertyInsights, AnalyticsEngine } from "@/lib/analytics";

interface AIInsight {
  type: 'performance' | 'recommendation' | 'alert' | 'prediction';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  action?: {
    label: string;
    href: string;
  };
}

interface AIInsightsProps {
  propertiesCount: number;
  tenantsCount: number;
  totalCollected: number;
  pendingPayments: number;
}

export function AIInsights({ propertiesCount, tenantsCount, totalCollected, pendingPayments }: AIInsightsProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI analysis
    const generateInsights = () => {
      const generatedInsights: AIInsight[] = [];

      // Performance insights
      if (pendingPayments > 0) {
        generatedInsights.push({
          type: 'alert',
          title: 'Payment Collection Alert',
          description: `You have ${pendingPayments} pending payments worth approximately ${formatCurrency(pendingPayments * 15000)}. Consider sending reminders.`,
          impact: 'high',
          action: {
            label: 'View Payments',
            href: '/payments?filter=pending'
          }
        });
      }

      if (tenantsCount > 0 && propertiesCount > 0) {
        const occupancyRate = (tenantsCount / (propertiesCount * 3)) * 100; // Assuming avg 3 units per property
        
        if (occupancyRate > 90) {
          generatedInsights.push({
            type: 'recommendation',
            title: 'High Occupancy Opportunity',
            description: `Your properties are ${occupancyRate.toFixed(1)}% occupied. Consider increasing rents by 5-10% to maximize revenue.`,
            impact: 'medium',
            action: {
              label: 'Review Properties',
              href: '/properties'
            }
          });
        } else if (occupancyRate < 70) {
          generatedInsights.push({
            type: 'alert',
            title: 'Low Occupancy Warning',
            description: `Occupancy rate is ${occupancyRate.toFixed(1)}%. Consider marketing improvements or rent adjustments.`,
            impact: 'high',
            action: {
              label: 'Marketing Tips',
              href: '/settings/marketing'
            }
          });
        }
      }

      // Revenue insights
      if (totalCollected > 0) {
        const monthlyProjection = totalCollected * 12;
        generatedInsights.push({
          type: 'prediction',
          title: 'Annual Revenue Projection',
          description: `Based on current collections, you're on track for ${formatCurrency(monthlyProjection)} annually.`,
          impact: 'medium',
          action: {
            label: 'View Reports',
            href: '/reports'
          }
        });
      }

      // Market insights
      generatedInsights.push({
        type: 'recommendation',
        title: 'eRITS Tax Preparation',
        description: 'Start preparing your monthly rental tax reports. The deadline is approaching.',
        impact: 'medium',
        action: {
          label: 'Generate Reports',
          href: '/reports/erits'
        }
      });

      // Growth opportunity
      if (propertiesCount < 5 && totalCollected > 50000) {
        generatedInsights.push({
          type: 'recommendation',
          title: 'Expansion Opportunity',
          description: 'With strong revenue performance, consider expanding your property portfolio.',
          impact: 'low',
          action: {
            label: 'Market Analysis',
            href: '/reports/market-analysis'
          }
        });
      }

      setInsights(generatedInsights);
      setLoading(false);
    };

    setTimeout(generateInsights, 1000); // Simulate AI processing time
  }, [propertiesCount, tenantsCount, totalCollected, pendingPayments]);

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'performance':
        return 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
      case 'recommendation':
        return 'https://cdn-icons-png.flaticon.com/512/1827/1827422.png';
      case 'alert':
        return 'https://cdn-icons-png.flaticon.com/512/1827/1827429.png';
      case 'prediction':
        return 'https://cdn-icons-png.flaticon.com/512/4225/4225618.png';
      default:
        return 'https://cdn-icons-png.flaticon.com/512/1827/1827422.png';
    }
  };

  const getImpactColor = (impact: AIInsight['impact']) => {
    switch (impact) {
      case 'high':
        return 'border-red-200 bg-red-50 text-red-900';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 text-yellow-900';
      case 'low':
        return 'border-blue-200 bg-blue-50 text-blue-900';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-900';
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
          <div>
            <h3 className="text-lg font-semibold">AI Insights</h3>
            <p className="text-sm text-slate-600">Analyzing your property data...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="text-4xl mb-3">AI</div>
          <h3 className="text-lg font-semibold text-slate-900">No Insights Available</h3>
          <p className="text-sm text-slate-600 mt-2">
            Start adding properties and tenants to get AI-powered insights.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">AI</div>
          <h3 className="text-lg font-semibold text-slate-900">Smart Insights</h3>
        </div>
        <Button variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {insights.map((insight, index) => (
          <Card key={index} className={`p-4 border-2 ${getImpactColor(insight.impact)}`}>
            <div className="flex items-start space-x-3">
              <img 
                src={getInsightIcon(insight.type)} 
                alt={insight.type}
                className="w-6 h-6 mt-1"
              />
              <div className="flex-1">
                <h4 className="font-semibold">{insight.title}</h4>
                <p className="text-sm mt-1 opacity-90">{insight.description}</p>
                {insight.action && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => window.location.href = insight.action!.href}
                  >
                    {insight.action.label}
                  </Button>
                )}
              </div>
              <div className="text-xs font-medium uppercase opacity-75">
                {insight.impact} impact
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center text-xs text-slate-500">
        AI insights are generated based on your property data and market trends
      </div>
    </div>
  );
}
