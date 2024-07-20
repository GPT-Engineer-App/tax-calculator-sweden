import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [monthlySalary, setMonthlySalary] = useState("");
  const [netSalary, setNetSalary] = useState(null);
  const [taxPercentage, setTaxPercentage] = useState(null);
  const [employerCost, setEmployerCost] = useState(null);

  const handleCalculate = () => {
    // Placeholder calculation logic - to be replaced with actual Swedish tax calculation
    const salary = parseFloat(monthlySalary);
    if (isNaN(salary)) return;

    const calculatedNetSalary = salary * 0.7; // Assuming 30% tax for now
    const calculatedTaxPercentage = 30;
    const calculatedEmployerCost = salary * 1.3; // Assuming 30% additional cost for employer

    setNetSalary(calculatedNetSalary.toFixed(2));
    setTaxPercentage(calculatedTaxPercentage.toFixed(2));
    setEmployerCost(calculatedEmployerCost.toFixed(2));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Swedish Tax Calculator</h1>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Enter Your Monthly Salary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="number"
              placeholder="Monthly Salary (SEK)"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(e.target.value)}
            />
            <Button onClick={handleCalculate} className="w-full">Calculate</Button>
          </div>
        </CardContent>
      </Card>

      {netSalary !== null && (
        <Card className="max-w-md mx-auto mt-6">
          <CardHeader>
            <CardTitle>Calculation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Net Salary:</strong> {netSalary} SEK</p>
              <p><strong>Tax Percentage:</strong> {taxPercentage}%</p>
              <p><strong>Total Employer Cost:</strong> {employerCost} SEK</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Index;