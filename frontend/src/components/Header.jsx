import React from 'react';
import { Card, CardContent } from '@shadcn/ui';

export function Header() {
  return (
    <Card className="mb-4">
      <CardContent>
        <h1 className="text-2xl font-bold">HCMT Supply Chain Dashboard</h1>
      </CardContent>
    </Card>
  );
}