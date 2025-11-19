
export enum Step {
  Intro = 1,
  Reason = 2,
  Content = 3,
  Implementation = 4,
  Results = 5,
  Conclusion = 6,
  Review = 7,
}

export interface ReportData {
  title: string;
  subject: string;
  class: string;
  reason: string;
  content: string;
  implementation: string;
  results: string;
  conclusion: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface PricingPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
}
