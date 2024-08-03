import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

const Wrapper = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <Card className="py-2 dark:bg-zinc-900 max-h-full scroll-y-auto">
      <CardHeader className="space-y-6">
        <CardTitle className="">{title}</CardTitle>
        <CardDescription className="w-4/5 leading-7">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default Wrapper;
