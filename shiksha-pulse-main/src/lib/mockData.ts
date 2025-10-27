export interface Student {
  id: string;
  name: string;
  department: string;
  year: number;
  riskLevel: "high" | "medium" | "low";
  engagementScore: number;
  attendance: number;
  cgpa: number;
  creditsCompleted: number;
  email: string;
  phone: string;
  predictionConfidence: number;
  riskFactors: string[];
}

export const mockStudents: Student[] = [
  {
    id: "2021CSE001",
    name: "Aarav Kumar",
    department: "Computer Science",
    year: 3,
    riskLevel: "high",
    engagementScore: 42,
    attendance: 65,
    cgpa: 6.2,
    creditsCompleted: 85,
    email: "aarav.kumar@college.edu",
    phone: "+91 98765 43210",
    predictionConfidence: 87,
    riskFactors: ["Low Attendance", "Declining CGPA", "Missing Assignments", "Low Library Usage", "Poor Participation"]
  },
  {
    id: "2021ECE045",
    name: "Priya Sharma",
    department: "Electronics",
    year: 3,
    riskLevel: "low",
    engagementScore: 88,
    attendance: 92,
    cgpa: 8.7,
    creditsCompleted: 120,
    email: "priya.sharma@college.edu",
    phone: "+91 98765 43211",
    predictionConfidence: 94,
    riskFactors: []
  },
  {
    id: "2022ME102",
    name: "Rahul Verma",
    department: "Mechanical",
    year: 2,
    riskLevel: "medium",
    engagementScore: 68,
    attendance: 78,
    cgpa: 7.1,
    creditsCompleted: 62,
    email: "rahul.verma@college.edu",
    phone: "+91 98765 43212",
    predictionConfidence: 79,
    riskFactors: ["Irregular Attendance", "Moderate CGPA Decline"]
  },
  {
    id: "2021CSE089",
    name: "Anjali Singh",
    department: "Computer Science",
    year: 3,
    riskLevel: "low",
    engagementScore: 91,
    attendance: 95,
    cgpa: 9.1,
    creditsCompleted: 128,
    email: "anjali.singh@college.edu",
    phone: "+91 98765 43213",
    predictionConfidence: 96,
    riskFactors: []
  },
  {
    id: "2022ECE078",
    name: "Vikram Patel",
    department: "Electronics",
    year: 2,
    riskLevel: "high",
    engagementScore: 38,
    attendance: 58,
    cgpa: 5.8,
    creditsCompleted: 48,
    email: "vikram.patel@college.edu",
    phone: "+91 98765 43214",
    predictionConfidence: 91,
    riskFactors: ["Very Low Attendance", "Low CGPA", "Multiple Failed Courses", "No Extracurricular", "Poor Online Engagement"]
  },
  {
    id: "2021ME055",
    name: "Sneha Reddy",
    department: "Mechanical",
    year: 3,
    riskLevel: "low",
    engagementScore: 85,
    attendance: 89,
    cgpa: 8.4,
    creditsCompleted: 115,
    email: "sneha.reddy@college.edu",
    phone: "+91 98765 43215",
    predictionConfidence: 93,
    riskFactors: []
  },
  {
    id: "2022CSE134",
    name: "Arjun Gupta",
    department: "Computer Science",
    year: 2,
    riskLevel: "medium",
    engagementScore: 64,
    attendance: 72,
    cgpa: 6.9,
    creditsCompleted: 58,
    email: "arjun.gupta@college.edu",
    phone: "+91 98765 43216",
    predictionConfidence: 82,
    riskFactors: ["Inconsistent Attendance", "Below Average CGPA"]
  },
  {
    id: "2021EE091",
    name: "Meera Iyer",
    department: "Electrical",
    year: 3,
    riskLevel: "low",
    engagementScore: 82,
    attendance: 87,
    cgpa: 8.2,
    creditsCompleted: 112,
    email: "meera.iyer@college.edu",
    phone: "+91 98765 43217",
    predictionConfidence: 89,
    riskFactors: []
  }
];

export const dashboardStats = {
  totalStudents: 1247,
  highRisk: 156,
  mediumRisk: 312,
  lowRisk: 779,
  avgEngagement: 72.4,
  disengagementRate: 12.5,
};

export const departmentData = [
  { department: "Computer Science", high: 45, medium: 89, low: 234 },
  { department: "Electronics", high: 38, medium: 76, low: 198 },
  { department: "Mechanical", high: 42, medium: 81, low: 189 },
  { department: "Electrical", high: 31, medium: 66, low: 158 },
];

export const engagementTrend = [
  { month: "Jan", score: 78 },
  { month: "Feb", score: 76 },
  { month: "Mar", score: 74 },
  { month: "Apr", score: 73 },
  { month: "May", score: 71 },
  { month: "Jun", score: 72 },
];
