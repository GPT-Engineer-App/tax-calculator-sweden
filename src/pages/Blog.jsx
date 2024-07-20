import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const blogArticles = [
  {
    title: "Understanding Swedish Tax Brackets",
    description: "A comprehensive guide to Swedish tax brackets and how they affect your income.",
    content: "Sweden uses a progressive tax system, meaning that the percentage of tax increases as the taxable amount increases. This article breaks down the different tax brackets and explains how they impact your take-home pay."
  },
  {
    title: "Tax Deductions for Entrepreneurs in Sweden",
    description: "Learn about the various tax deductions available for small business owners and entrepreneurs in Sweden.",
    content: "As an entrepreneur in Sweden, you may be eligible for several tax deductions that can help reduce your overall tax burden. This article explores common deductions such as home office expenses, travel costs, and equipment purchases."
  },
  {
    title: "The Swedish Pension System Explained",
    description: "An overview of the Swedish pension system and how it affects your taxes and retirement savings.",
    content: "The Swedish pension system is composed of three parts: the national retirement pension, the occupational pension, and private savings. This article explains how each component works and how they impact your taxes and long-term financial planning."
  }
];

const Blog = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Tax Blog</h1>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid gap-6">
          {blogArticles.map((article, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
                <CardDescription>{article.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{article.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Blog;