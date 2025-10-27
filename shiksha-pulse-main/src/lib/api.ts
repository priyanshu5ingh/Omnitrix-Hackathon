// API service functions for connecting to Flask backend
const API_BASE_URL = 'http://localhost:5000/api';

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
  student_id?: string; // For API compatibility
}

export interface DashboardStats {
  totalStudents: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  avgEngagement: number;
  disengagementRate: number;
}

export interface DepartmentData {
  department: string;
  high: number;
  medium: number;
  low: number;
}

export interface EngagementTrend {
  month: string;
  score: number;
}

// API Functions
export const apiService = {
  // Dashboard endpoints
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/dashboard`);
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
  },

  async getStudents(params?: {
    search?: string;
    risk?: string;
    department?: string;
    page?: number;
    per_page?: number;
  }): Promise<{ students: Student[]; total_pages: number; current_page: number; total_students: number }> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.risk) queryParams.append('risk', params.risk);
    if (params?.department) queryParams.append('department', params.department);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

    const response = await fetch(`${API_BASE_URL}/students?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch students');
    return response.json();
  },

  async getStudentById(id: string): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/student/${id}`);
    if (!response.ok) throw new Error('Failed to fetch student details');
    return response.json();
  },

  async predictStudent(data: any): Promise<{ risk_level: string; engagement_score: number; confidence: number }> {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to predict');
    return response.json();
  },

  async simulateScenario(data: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to simulate');
    return response.json();
  },

  async getAnalytics(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/advanced_analytics`);
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return response.json();
  },

  async uploadBatchFile(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Failed to upload file');
    return response.json();
  },

  async getSHAPAnalysis(studentId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/shap_analysis/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch SHAP analysis');
    return response.json();
  },

  async sendAlert(data: { student_id: string; alert_type: string }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/send_alert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to send alert');
    return response.json();
  },

  async getModelPerformance(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/model_performance`);
    if (!response.ok) throw new Error('Failed to fetch model performance');
    return response.json();
  }
};

// Data transformation helpers
export function transformStudentData(apiStudent: any): Student {
  return {
    id: apiStudent.student_id || apiStudent.id || '',
    name: apiStudent.name || apiStudent.student_id || 'N/A',
    department: apiStudent.department?.toString() || '',
    year: apiStudent.year || 1,
    riskLevel: apiStudent.risk_level?.toLowerCase() || 'low',
    engagementScore: Math.round(apiStudent.engagement_score || 0),
    attendance: Math.round(apiStudent.attendance || apiStudent.attendance_rate || 0),
    cgpa: apiStudent.cgpa || apiStudent.academic_performance || 0,
    creditsCompleted: apiStudent.credits_completed || 0,
    email: apiStudent.email || '',
    phone: apiStudent.phone || '',
    predictionConfidence: Math.round(apiStudent.confidence || 0),
    riskFactors: apiStudent.risk_factors || [],
    student_id: apiStudent.student_id || apiStudent.id
  };
}

export function transformDashboardStats(apiStats: any): DashboardStats {
  return {
    totalStudents: apiStats.total_students || 0,
    highRisk: apiStats.high_risk || 0,
    mediumRisk: apiStats.medium_risk || 0,
    lowRisk: apiStats.low_risk || 0,
    avgEngagement: Math.round(apiStats.avg_engagement_score || 0),
    disengagementRate: Math.round(apiStats.disengagement_rate || 0)
  };
}
