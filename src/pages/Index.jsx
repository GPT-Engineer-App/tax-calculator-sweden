import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const taxRates = [
  { income: "0 - 540,700", rate: "32%" },
  { income: "540,701 - 709,300", rate: "52%" },
  { income: "709,301+", rate: "57%" },
];

const Index = () => {
  const [monthlySalary, setMonthlySalary] = useState(30000);
  const [netSalary, setNetSalary] = useState(null);
  const [taxPercentage, setTaxPercentage] = useState(null);
  const [employerCost, setEmployerCost] = useState(null);

  const handleSliderChange = (value) => {
    setMonthlySalary(value[0]);
  };

  const handleCalculate = () => {
    const salary = monthlySalary;
    if (isNaN(salary)) return;

    const calculatedNetSalary = salary * 0.7; // Assuming 30% tax for now
    const calculatedTaxPercentage = 30;
    const calculatedEmployerCost = salary * 1.3; // Assuming 30% additional cost for employer

    setNetSalary(calculatedNetSalary);
    setTaxPercentage(calculatedTaxPercentage);
    setEmployerCost(calculatedEmployerCost);
  };

  useEffect(() => {
    handleCalculate();
  }, [monthlySalary]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Swedish Tax Calculator</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Enter Your Monthly Salary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Slider
                  value={[monthlySalary]}
                  onValueChange={handleSliderChange}
                  max={100000}
                  step={1000}
                  className="mb-4"
                />
                <Input
                  type="text"
                  value={formatNumber(monthlySalary)}
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
                <CardTitle>Calculation Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Net Salary:</strong> {formatNumber(netSalary.toFixed(2))} SEK</p>
                  <p><strong>Tax Percentage:</strong> {taxPercentage.toFixed(2)}%</p>
                  <p><strong>Total Employer Cost:</strong> {formatNumber(employerCost.toFixed(2))} SEK</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Swedish Tax Rates</CardTitle>
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
                    <TableCell>{rate.income}</TableCell>
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