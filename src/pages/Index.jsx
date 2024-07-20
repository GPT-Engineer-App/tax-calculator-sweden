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

const Index = () => {
  const [salary, setSalary] = useState(30000);
  const [netSalary, setNetSalary] = useState(null);
  const [taxPercentage, setTaxPercentage] = useState(null);
  const [employerCost, setEmployerCost] = useState(null);
  const [isYearly, setIsYearly] = useState(false);
  const [isTableYearly, setIsTableYearly] = useState(true);

  const handleSliderChange = (value) => {
    setSalary(value[0]);
  };

  const handleCalculate = () => {
    const monthlySalary = isYearly ? salary / 12 : salary;
    if (isNaN(monthlySalary)) return;

    const calculatedNetSalary = monthlySalary * 0.7; // Assuming 30% tax for now
    const calculatedTaxPercentage = 30;
    const calculatedEmployerCost = monthlySalary * 1.3; // Assuming 30% additional cost for employer

    setNetSalary(isYearly ? calculatedNetSalary * 12 : calculatedNetSalary);
    setTaxPercentage(calculatedTaxPercentage);
    setEmployerCost(isYearly ? calculatedEmployerCost * 12 : calculatedEmployerCost);
  };

  useEffect(() => {
    handleCalculate();
  }, [salary, isYearly]);

  const togglePeriod = () => {
    setIsYearly(!isYearly);
    setSalary(isYearly ? salary / 12 : salary * 12);
  };

  const toggleTablePeriod = () => {
    setIsTableYearly(!isTableYearly);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Swedish Tax Calculator</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Enter Your {isYearly ? "Yearly" : "Monthly"} Salary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="period-toggle" checked={isYearly} onCheckedChange={togglePeriod} />
                  <Label htmlFor="period-toggle">
                    {isYearly ? "Yearly" : "Monthly"}
                  </Label>
                </div>
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
                <Button onClick={handleCalculate} className="w-full">Calculate</Button>
              </div>
            </CardContent>
          </Card>

          {netSalary !== null && (
            <Card>
              <CardHeader>
                <CardTitle>Calculation Results ({isYearly ? "Yearly" : "Monthly"})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Net Salary:</strong> {formatNumber(netSalary)} SEK</p>
                  <p><strong>Tax Percentage:</strong> {taxPercentage.toFixed(2)}%</p>
                  <p><strong>Total Employer Cost:</strong> {formatNumber(employerCost)} SEK</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
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
    </div>
  );
};

export default Index;