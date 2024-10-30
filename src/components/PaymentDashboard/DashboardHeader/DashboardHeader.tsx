import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import React from "react";

interface DashboardHeaderProps {
  title: string;
  description: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
};

export default DashboardHeader;
