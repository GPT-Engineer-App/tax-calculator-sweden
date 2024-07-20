import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const formatNumber = (number) => {
  return Math.round(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const parseFormattedNumber = (formattedNumber) => {
  return parseInt(formattedNumber.replace(/\s/g, ""), 10);
};

const taxRates = [
  { yearlyIncome: "0 - 540,700", monthlyIncome: "0 - 45,058", rate: "32%" },
  { yearlyIncome: "540,701 - 709,300", monthlyIncome: "45,059 - 59,108", rate: "52%" },
  { yearlyIncome: "709,301+", monthlyIncome: "59,109+", rate: "57%" },
];

const SOCIAL_SECURITY_PERCENTAGE = 31.42;
const DIVIDEND_TAX_RATE = 0.30;
const CAPITAL_GAINS_TAX_RATE = 0.30;

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

  const socialSecurity = yearlySalary * (SOCIAL_SECURITY_PERCENTAGE / 100);
  const pensionContribution = Math.min(yearlySalary * 0.07, 39700);

  return {
    incomeTax: tax,
    socialSecurity,
    pensionContribution,
    totalTax: tax + pensionContribution,
  };
};

const stockholmTaxTable = [
  { grossSalary: 10000, withholding: 1363, percentage: 13.63, netSalary: 8637, socialTax: 3142, totalCost: 13142 },
  { grossSalary: 15000, withholding: 2653, percentage: 17.69, netSalary: 12347, socialTax: 4713, totalCost: 19713 },
  { grossSalary: 20000, withholding: 3999, percentage: 20.00, netSalary: 16001, socialTax: 6284, totalCost: 26284 },
  { grossSalary: 25000, withholding: 5345, percentage: 21.38, netSalary: 19655, socialTax: 7855, totalCost: 32855 },
  { grossSalary: 30000, withholding: 6695, percentage: 22.32, netSalary: 23305, socialTax: 9426, totalCost: 39426 },
  { grossSalary: 35000, withholding: 8195, percentage: 23.41, netSalary: 26805, socialTax: 10997, totalCost: 45997 },
  { grossSalary: 40000, withholding: 10309, percentage: 25.77, netSalary: 29691, socialTax: 12568, totalCost: 52568 },
  { grossSalary: 45000, withholding: 12809, percentage: 28.46, netSalary: 32191, socialTax: 14139, totalCost: 59139 },
  { grossSalary: 50000, withholding: 15309, percentage: 30.62, netSalary: 34691, socialTax: 15710, totalCost: 65710 },
  { grossSalary: 55000, withholding: 18047, percentage: 32.81, netSalary: 36953, socialTax: 17281, totalCost: 72281 },
  { grossSalary: 60000, withholding: 20947, percentage: 34.91, netSalary: 39053, socialTax: 18852, totalCost: 78852 },
  { grossSalary: 65000, withholding: 23847, percentage: 36.69, netSalary: 41153, socialTax: 20423, totalCost: 85423 },
  { grossSalary: 70000, withholding: 26747, percentage: 38.21, netSalary: 43253, socialTax: 21994, totalCost: 91994 },
  { grossSalary: 75000, withholding: 29647, percentage: 39.53, netSalary: 45353, socialTax: 23565, totalCost: 98565 },
  { grossSalary: 80000, withholding: 32547, percentage: 40.68, netSalary: 47453, socialTax: 25136, totalCost: 105136 },
  { grossSalary: 85000, withholding: 35447, percentage: 41.70, netSalary: 49553, socialTax: 26707, totalCost: 111707 },
  { grossSalary: 90000, withholding: 38347, percentage: 42.61, netSalary: 51653, socialTax: 28278, totalCost: 118278 },
  { grossSalary: 95000, withholding: 41247, percentage: 43.42, netSalary: 53753, socialTax: 29849, totalCost: 124849 },
  { grossSalary: 100000, withholding: 44147, percentage: 44.15, netSalary: 55853, socialTax: 31420, totalCost: 131420 },
  { grossSalary: 105000, withholding: 47047, percentage: 44.81, netSalary: 57953, socialTax: 32991, totalCost: 137991 },
  { grossSalary: 110000, withholding: 49947, percentage: 45.41, netSalary: 60053, socialTax: 34562, totalCost: 144562 },
  { grossSalary: 115000, withholding: 52847, percentage: 45.95, netSalary: 62153, socialTax: 36133, totalCost: 151133 },
  { grossSalary: 120000, withholding: 55747, percentage: 46.46, netSalary: 64253, socialTax: 37704, totalCost: 157704 },
  { grossSalary: 125000, withholding: 58647, percentage: 46.92, netSalary: 66353, socialTax: 39275, totalCost: 164275 },
  { grossSalary: 130000, withholding: 61547, percentage: 47.34, netSalary: 68453, socialTax: 40846, totalCost: 170846 },
  { grossSalary: 135000, withholding: 64447, percentage: 47.74, netSalary: 70553, socialTax: 42417, totalCost: 177417 },
  { grossSalary: 140000, withholding: 67347, percentage: 48.11, netSalary: 72653, socialTax: 43988, totalCost: 183988 },
  { grossSalary: 145000, withholding: 70247, percentage: 48.45, netSalary: 74753, socialTax: 45559, totalCost: 190559 },
  { grossSalary: 150000, withholding: 73147, percentage: 48.76, netSalary: 76853, socialTax: 47130, totalCost: 197130 },
];

const Index = () => {
  const { t, i18n } = useTranslation();
  const [salary, setSalary] = useState(30000);
  const [comparisonSalary, setComparisonSalary] = useState(40000);
  const [taxBreakdown, setTaxBreakdown] = useState(null);
  const [comparisonTaxBreakdown, setComparisonTaxBreakdown] = useState(null);
  const [isYearly, setIsYearly] = useState(false);
  const [isTableYearly, setIsTableYearly] = useState(true);
  const [dividends, setDividends] = useState(0);
  const [capitalGains, setCapitalGains] = useState(0);
  const [activeTab, setActiveTab] = useState("income");

  const handleSliderChange = (value) => {
    setSalary(value[0]);
  };

  const handleComparisonSliderChange = (value) => {
    setComparisonSalary(value[0]);
  };

  const handleSalaryInputChange = (event) => {
    const value = parseFormattedNumber(event.target.value);
    if (!isNaN(value)) {
      setSalary(value);
    }
  };

  const handleComparisonSalaryInputChange = (event) => {
    const value = parseFormattedNumber(event.target.value);
    if (!isNaN(value)) {
      setComparisonSalary(value);
    }
  };

  const handleDividendsChange = (event) => {
    const value = parseFormattedNumber(event.target.value);
    if (!isNaN(value)) {
      setDividends(value);
    }
  };

  const handleCapitalGainsChange = (event) => {
    const value = parseFormattedNumber(event.target.value);
    if (!isNaN(value)) {
      setCapitalGains(value);
    }
  };

  const calculateBreakdown = (currentSalary, setBreakdownState) => {
    const taxResult = calculateTax(currentSalary, isYearly);
    const grossSalary = isYearly ? currentSalary : currentSalary * 12;
    const netSalary = grossSalary - taxResult.totalTax;
    const taxPercentage = (taxResult.totalTax / grossSalary) * 100;
    const employerCost = grossSalary + taxResult.socialSecurity;

    const dividendTax = dividends * DIVIDEND_TAX_RATE;
    const capitalGainsTax = capitalGains * CAPITAL_GAINS_TAX_RATE;

    setBreakdownState({
      grossSalary,
      netSalary,
      taxPercentage,
      employerCost,
      dividendTax,
      capitalGainsTax,
      ...taxResult,
    });
  };

  useEffect(() => {
    calculateBreakdown(salary, setTaxBreakdown);
    calculateBreakdown(comparisonSalary, setComparisonTaxBreakdown);
  }, [salary, comparisonSalary, isYearly, dividends, capitalGains]);

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
        <CardTitle>{t(title)} ({isYearly ? t('yearly') : t('monthly')})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {activeTab === "income" && (
              <>
                <TableRow>
                  <TableCell>{t('grossSalary')}</TableCell>
                  <TableCell className="text-right">{formatNumber(isYearly ? breakdown.grossSalary : breakdown.grossSalary / 12)} SEK</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('incomeTax')}</TableCell>
                  <TableCell className="text-right">-{formatNumber(isYearly ? breakdown.incomeTax : breakdown.incomeTax / 12)} SEK</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('pensionContribution')}</TableCell>
                  <TableCell className="text-right">-{formatNumber(isYearly ? breakdown.pensionContribution : breakdown.pensionContribution / 12)} SEK</TableCell>
                </TableRow>
              </>
            )}
            {activeTab === "investments" && (
              <>
                <TableRow>
                  <TableCell>{t('dividendTax')}</TableCell>
                  <TableCell className="text-right">-{formatNumber(breakdown.dividendTax)} SEK</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('capitalGainsTax')}</TableCell>
                  <TableCell className="text-right">-{formatNumber(breakdown.capitalGainsTax)} SEK</TableCell>
                </TableRow>
              </>
            )}
            {activeTab === "income" && (
              <>
                <TableRow className="font-bold">
                  <TableCell>{t('netSalary')}</TableCell>
                  <TableCell className="text-right">{formatNumber(isYearly ? breakdown.netSalary : breakdown.netSalary / 12)} SEK</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('taxPercentage')}</TableCell>
                  <TableCell className="text-right">{breakdown.taxPercentage.toFixed(2)}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('employerSocialSecurity')}</TableCell>
                  <TableCell className="text-right">{formatNumber(isYearly ? breakdown.socialSecurity : breakdown.socialSecurity / 12)} SEK</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('socialSecurityPercentage')}</TableCell>
                  <TableCell className="text-right">{SOCIAL_SECURITY_PERCENTAGE.toFixed(2)}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t('totalEmployerCost')}</TableCell>
                  <TableCell className="text-right">{formatNumber(isYearly ? breakdown.employerCost : breakdown.employerCost / 12)} SEK</TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">{t('title')}</h1>
      <div className="flex justify-end mb-4">
        <Select
          value={i18n.language}
          onValueChange={(value) => i18n.changeLanguage(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('language')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="sv">Svenska</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Tabs defaultValue="income" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="income">{t('income')}</TabsTrigger>
          <TabsTrigger value="investments">{t('investments')}</TabsTrigger>
        </TabsList>
        <TabsContent value="income">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{t('enterSalary', { period: isYearly ? t('yearly') : t('monthly') })}</span>
                  <div className="flex items-center space-x-2">
                    <Switch id="period-toggle" checked={isYearly} onCheckedChange={togglePeriod} />
                    <Label htmlFor="period-toggle" className="text-sm">
                      {isYearly ? t('yearly') : t('monthly')}
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
                    onChange={handleSalaryInputChange}
                    className="text-right"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t('comparisonSalary', { period: isYearly ? t('yearly') : t('monthly') })}</CardTitle>
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
                    onChange={handleComparisonSalaryInputChange}
                    className="text-right"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="investments">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t('dividends')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    type="text"
                    value={formatNumber(dividends)}
                    onChange={handleDividendsChange}
                    className="text-right"
                  />
                  <p>{t('dividendTaxRate')}: {DIVIDEND_TAX_RATE * 100}%</p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t('capitalGains')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    type="text"
                    value={formatNumber(capitalGains)}
                    onChange={handleCapitalGainsChange}
                    className="text-right"
                  />
                  <p>{t('capitalGainsTaxRate')}: {CAPITAL_GAINS_TAX_RATE * 100}%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {taxBreakdown && renderTaxBreakdown(taxBreakdown, 'taxBreakdown')}
        {comparisonTaxBreakdown && renderTaxBreakdown(comparisonTaxBreakdown, 'comparisonTaxBreakdown')}
      </div>

      {activeTab === "income" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{t('swedishTaxRates', { period: isTableYearly ? t('yearly') : t('monthly') })}</span>
              <div className="flex items-center space-x-2">
                <Switch id="table-period-toggle" checked={isTableYearly} onCheckedChange={toggleTablePeriod} />
                <Label htmlFor="table-period-toggle" className="text-sm">
                  {isTableYearly ? t('yearly') : t('monthly')}
                </Label>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('income')}</TableHead>
                  <TableHead>{t('taxRate')}</TableHead>
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
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t('title')} - {t('swedishTaxRates', { period: t('monthly') })}</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('grossSalary')} (SEK)</TableHead>
                  <TableHead>{t('incomeTax')} (SEK)</TableHead>
                  <TableHead>{t('taxPercentage')}</TableHead>
                  <TableHead>{t('netSalary')} (SEK)</TableHead>
                  <TableHead>{t('employerSocialSecurity')} (SEK)</TableHead>
                  <TableHead>{t('totalEmployerCost')} (SEK)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockholmTaxTable.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatNumber(row.grossSalary)}</TableCell>
                    <TableCell>{formatNumber(row.withholding)}</TableCell>
                    <TableCell>{row.percentage.toFixed(2)}%</TableCell>
                    <TableCell>{formatNumber(row.netSalary)}</TableCell>
                    <TableCell>{formatNumber(row.socialTax)}</TableCell>
                    <TableCell>{formatNumber(row.totalCost)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;