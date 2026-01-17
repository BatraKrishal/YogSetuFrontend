"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Loader2, CheckCircle, AlertTriangle, RefreshCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type ReconciliationData = {
  stripeSucceededCount: number;
  stripeSucceededAmount: string;
  walletCreditedAmount: string;
  difference: string;
  healthy: boolean;
};

export default function PaymentReconciliation() {
  const [data, setData] = useState<ReconciliationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchData() {
    setLoading(true);
    try {
      // Default to last 30 days or similar if backend supports it, or just all time
      const res = await api.getPaymentReconciliation();
      setData(res);
    } catch (error) {
      console.error("Failed to fetch payment reconciliation", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading && !data) {
    return (
      <Card>
        <CardContent className="flex justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-zinc-500">
          Failed to load reconciliation data.
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="mt-2 text-blue-600"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`border-l-4 ${
        data.healthy ? "border-l-green-500" : "border-l-red-500"
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-zinc-900 flex items-center gap-2">
              Payment Reconciliation
              {data.healthy ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
            </h3>
            <p className="text-sm text-zinc-500">
              Comparing Stripe payments vs Wallet credits
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCcw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-600">Stripe Succeeded (Total)</span>
            <span className="font-medium">
              ₹{Number(data.stripeSucceededAmount).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-600">Wallet Credited (Total)</span>
            <span className="font-medium">
              ₹{Number(data.walletCreditedAmount).toFixed(2)}
            </span>
          </div>

          <div className="pt-2 border-t border-zinc-100 flex justify-between text-sm font-bold">
            <span className="text-zinc-900">Difference</span>
            <span
              className={
                Number(data.difference) === 0
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              ₹{Number(data.difference).toFixed(2)}
            </span>
          </div>
        </div>

        {!data.healthy && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-md">
            <strong>Action Required:</strong> Discrepancy detected between
            payment provider and internal wallet ledger. Please investigate
            recent transactions.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
