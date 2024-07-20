import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StockholmTaxGraph = ({ data }) => {
  const { t } = useTranslation();

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{t('stockholmTaxGraph')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="grossSalary" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="grossSalary" stroke="#8884d8" name={t('grossSalary')} />
            <Line type="monotone" dataKey="withholding" stroke="#82ca9d" name={t('incomeTax')} />
            <Line type="monotone" dataKey="netSalary" stroke="#ffc658" name={t('netSalary')} />
            <Line type="monotone" dataKey="socialTax" stroke="#ff7300" name={t('employerSocialSecurity')} />
            <Line type="monotone" dataKey="totalCost" stroke="#ff0000" name={t('totalEmployerCost')} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default StockholmTaxGraph;