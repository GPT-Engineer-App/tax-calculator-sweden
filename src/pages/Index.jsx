import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const formatNumber = (number) => {
  return Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const taxRates = [
  { yearlyIncome: "0 - 540,700", monthlyIncome: "0 - 45,058", rate: "32%" },
  { yearlyIncome: "540,701 - 709,300", monthlyIncome: "45,059 - 59,108", rate: "52%" },
  { yearlyIncome: "709,301+", monthlyIncome: "59,109+", rate: "57%" },
];

const SOCIAL_SECURITY_PERCENTAGE = 31.42;

const calculateTax = (salary, isYearly) => {
  const yearlySalary = isYearly ? salary : salary * 12;
  let tax = 0;
  let remainingSalary = yearlySalary;

  if (remainingSalary > 709300) {
    tax += (remainingSalary - 709300) * 0.57;
    remainingSalary = 709300;
  }
  if (remainingSalary > 540700) {
    tax += (remainingSalary - 540700) * 0.52;
    remainingSalary = 540700;
  }
  tax += remainingSalary * 0.32;

  // Employer's social security contribution (31.42% of gross salary)
  const socialSecurity = yearlySalary * (SOCIAL_SECURITY_PERCENTAGE / 100);

  // Employee's pension contribution (7% of gross salary, max 39,700 SEK per year)
  const pensionContribution = Math.min(yearlySalary * 0.07, 39700);

  return {
    incomeTax: tax,
    socialSecurity,
    pensionContribution,
    totalTax: tax + pensionContribution, // Only income tax and pension contribution affect net salary
  };
};

const Index = () => {
  const [salary, setSalary] = useState(30000);
  const [comparisonSalary, setComparisonSalary] = useState(40000);
  const [taxBreakdown, setTaxBreakdown] = useState(null);
  const [comparisonTaxBreakdown, setComparisonTaxBreakdown] = useState(null);
  const [isYearly, setIsYearly] = useState(false);
  const [isTableYearly, setIsTableYearly] = useState(true);

  const handleSliderChange = (value) => {
    setSalary(value[0]);
  };

  const handleComparisonSliderChange = (value) => {
    setComparisonSalary(value[0]);
  };

  const calculateBreakdown = (currentSalary, setBreakdownState) => {
    const taxResult = calculateTax(currentSalary, isYearly);
    const grossSalary = isYearly ? currentSalary : currentSalary * 12;
    const netSalary = grossSalary - taxResult.totalTax;
    const taxPercentage = (taxResult.totalTax / grossSalary) * 100;
    const employerCost = grossSalary + taxResult.socialSecurity;

    setBreakdownState({
      grossSalary,
      netSalary,
      taxPercentage,
      employerCost,
      ...taxResult,
    });
  };

  useEffect(() => {
    calculateBreakdown(salary, setTaxBreakdown);
    calculateBreakdown(comparisonSalary, setComparisonTaxBreakdown);
  }, [salary, comparisonSalary, isYearly]);

  const togglePeriod = () => {
    setIsYearly(!isYearly);
    setSalary(isYearly ? salary / 12 : salary * 12);
    setComparisonSalary(isYearly ? comparisonSalary / 12 : comparisonSalary * 12);
  };

  const toggleTablePeriod = () => {
    setIsTableYearly(!isTableYearly);
  };

  const renderTaxBreakdown = (breakdown, title) => (
    <Card>
      <CardHeader>
        <CardTitle>{title} ({isYearly ? "Yearly" : "Monthly"})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Gross Salary</TableCell>
              <TableCell className="text-right">{formatNumber(isYearly ? breakdown.grossSalary : breakdown.grossSalary / 12)} SEK</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Income Tax</TableCell>
              <TableCell className="text-right">-{formatNumber(isYearly ? breakdown.incomeTax : breakdown.incomeTax / 12)} SEK</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Pension Contribution</TableCell>
              <TableCell className="text-right">-{formatNumber(isYearly ? breakdown.pensionContribution : breakdown.pensionContribution / 12)} SEK</TableCell>
            </TableRow>
            <TableRow className="font-bold">
              <TableCell>Net Salary</TableCell>
              <TableCell className="text-right">{formatNumber(isYearly ? breakdown.netSalary : breakdown.netSalary / 12)} SEK</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Tax Percentage</TableCell>
              <TableCell className="text-right">{breakdown.taxPercentage.toFixed(2)}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Employer's Social Security Contribution</TableCell>
              <TableCell className="text-right">{formatNumber(isYearly ? breakdown.socialSecurity : breakdown.socialSecurity / 12)} SEK</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Social Security Percentage</TableCell>
              <TableCell className="text-right">{SOCIAL_SECURITY_PERCENTAGE.toFixed(2)}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total Employer Cost</TableCell>
              <TableCell className="text-right">{formatNumber(isYearly ? breakdown.employerCost : breakdown.employerCost / 12)} SEK</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Swedish Tax Calculator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Enter Your {isYearly ? "Yearly" : "Monthly"} Salary</span>
              <div className="flex items-center space-x-2">
                <Switch id="period-toggle" checked={isYearly} onCheckedChange={togglePeriod} />
                <Label htmlFor="period-toggle" className="text-sm">
                  {isYearly ? "Yearly" : "Monthly"}
                </Label>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Slider
                value={[salary]}
                onValueChange={handleSliderChange}
                max={isYearly ? 1200000 : 100000}
                step={isYearly ? 12000 : 1000}
                className="mb-4"
              />
              <Input
                type="text"
                value={formatNumber(salary)}
                readOnly
                className="text-right"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Comparison Salary ({isYearly ? "Yearly" : "Monthly"})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Slider
                value={[comparisonSalary]}
                onValueChange={handleComparisonSliderChange}
                max={isYearly ? 1200000 : 100000}
                step={isYearly ? 12000 : 1000}
                className="mb-4"
              />
              <Input
                type="text"
                value={formatNumber(comparisonSalary)}
                readOnly
                className="text-right"
              />
            </div>
          </CardContent>
        </Card>

        {taxBreakdown && renderTaxBreakdown(taxBreakdown, "Tax Breakdown")}
        {comparisonTaxBreakdown && renderTaxBreakdown(comparisonTaxBreakdown, "Comparison Tax Breakdown")}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Swedish Tax Rates ({isTableYearly ? "Yearly" : "Monthly"})</span>
            <div className="flex items-center space-x-2">
              <Switch id="table-period-toggle" checked={isTableYearly} onCheckedChange={toggleTablePeriod} />
              <Label htmlFor="table-period-toggle" className="text-sm">
                {isTableYearly ? "Yearly" : "Monthly"}
              </Label>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Income (SEK)</TableHead>
                <TableHead>Tax Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxRates.map((rate, index) => (
                <TableRow key={index}>
                  <TableCell>{isTableYearly ? rate.yearlyIncome : rate.monthlyIncome}</TableCell>
                  <TableCell>{rate.rate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;