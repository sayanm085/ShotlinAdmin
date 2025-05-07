import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function FinancialCalculator() {
  const [total, setTotal] = useState(0);
  const [referred, setReferred] = useState(false);
  const [currency, setCurrency] = useState('INR');

  const symbol = currency === 'INR' ? '₹' : '$';

  const percentages = {
    development: 0.4,
    shareholder: 0.2,
    expenses: 0.2,
    advertisement: 0.2,
  };

  const devBreakdown = {
    designer: 0.1,
    frontend: 0.3,
    backend: 0.4,
    devops: 0.2,
  };

  const adBreakdown = referred
    ? { referral: 0.05, services: 0.15 }
    : { services: 0.2 };

  const [results, setResults] = useState({});

  useEffect(() => {
    const t = parseFloat(total) || 0;
    const dev = t * percentages.development;

    setResults({
      development: dev,
      shareholder: t * percentages.shareholder,
      expenses: t * percentages.expenses,
      advertisement: t * percentages.advertisement,
      devDetails: {
        designer: dev * devBreakdown.designer,
        frontend: dev * devBreakdown.frontend,
        backend: dev * devBreakdown.backend,
        devops: dev * devBreakdown.devops,
      },
      adDetails: Object.fromEntries(
        Object.entries(adBreakdown).map(([k, pct]) => [k, t * pct])
      ),
    });
  }, [total, referred]);

  return (
    <Card className="max-w-xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Financial Distribution Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 1) Total Amount */}
        <div>
          <Label htmlFor="total">Total Amount</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              {symbol}
            </span>
            <Input
              id="total"
              type="number"
              placeholder="0"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* 2) Referred By */}
        <div className="flex items-center space-x-2">
          <Label htmlFor="referred">Referred By</Label>
          <Switch id="referred" checked={referred} onCheckedChange={setReferred} />
        </div>

        {/* 3) Currency Selector */}
        <div>
          <Label className="mb-1 block">Currency</Label>
          <ToggleGroup
            type="single"
            value={currency}
            onValueChange={(val) => val && setCurrency(val)}
            className="inline-flex rounded-lg bg-muted p-1"
          >
            <ToggleGroupItem
              value="INR"
              className="px-4 py-2 text-sm font-medium rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              ₹ INR
            </ToggleGroupItem>
            <ToggleGroupItem
              value="USD"
              className="px-4 py-2 text-sm font-medium rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              $ USD
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* 4) Breakdown Accordion */}
        <Accordion type="single" collapsible>
          <AccordionItem value="breakdown">
            <AccordionTrigger>View Breakdown</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {['development', 'shareholder', 'expenses', 'advertisement'].map((key) => (
                    <div key={key} className="p-4 bg-gray-50 rounded">
                      <p className="font-semibold capitalize">
                        {key} ({percentages[key] * 100}%)
                      </p>
                      <p>
                        {symbol}{results[key]?.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <Accordion type="multiple" collapsible>
                  <AccordionItem value="dev">
                    <AccordionTrigger>Development Details</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(results.devDetails || {}).map(([k, v]) => (
                          <div key={k} className="p-3 bg-white rounded border">
                            <p className="capitalize">{k}</p>
                            <p>
                              {symbol}{v.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="ad">
                    <AccordionTrigger>Advertisement Details</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(results.adDetails || {}).map(([k, v]) => (
                          <div key={k} className="p-3 bg-white rounded border">
                            <p className="capitalize">
                              {k === 'services' ? 'Ad Services' : 'Referral'}
                            </p>
                            <p>
                              {symbol}{v.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
