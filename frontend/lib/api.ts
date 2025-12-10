const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_URL;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  getHeaders() {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData: { name: string; email: string; password: string }) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.data.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  async login(credentials: { email: string; password: string }) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.data.token) {
      this.setToken(data.data.token);
    }
    return data;
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  async updateProfile(userData: any) {
    return this.request('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async updatePassword(passwords: { currentPassword: string; newPassword: string }) {
    return this.request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(passwords),
    });
  }

  logout() {
    this.removeToken();
  }

  // Workout endpoints
  async getWorkouts(params?: { page?: number; limit?: number; category?: string; search?: string }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/workouts${queryString}`);
  }

  async getWorkout(id: string) {
    return this.request(`/workouts/${id}`);
  }

  async createWorkout(workoutData: any) {
    return this.request('/workouts', {
      method: 'POST',
      body: JSON.stringify(workoutData),
    });
  }

  async updateWorkout(id: string, workoutData: any) {
    return this.request(`/workouts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workoutData),
    });
  }

  async deleteWorkout(id: string) {
    return this.request(`/workouts/${id}`, {
      method: 'DELETE',
    });
  }

  async duplicateWorkout(id: string) {
    return this.request(`/workouts/${id}/duplicate`, {
      method: 'POST',
    });
  }

  async addExerciseToWorkout(workoutId: string, exerciseData: any) {
    return this.request(`/workouts/${workoutId}/exercises`, {
      method: 'POST',
      body: JSON.stringify(exerciseData),
    });
  }

  async removeExerciseFromWorkout(workoutId: string, exerciseId: string) {
    return this.request(`/workouts/${workoutId}/exercises/${exerciseId}`, {
      method: 'DELETE',
    });
  }

  // Exercise endpoints
  async getExercises(params?: { page?: number; limit?: number; category?: string; muscle?: string; difficulty?: string; search?: string }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/exercises${queryString}`);
  }

  async getExercise(id: string) {
    return this.request(`/exercises/${id}`);
  }

  async createExercise(exerciseData: any) {
    return this.request('/exercises', {
      method: 'POST',
      body: JSON.stringify(exerciseData),
    });
  }

  async updateExercise(id: string, exerciseData: any) {
    return this.request(`/exercises/${id}`, {
      method: 'PUT',
      body: JSON.stringify(exerciseData),
    });
  }

  async deleteExercise(id: string) {
    return this.request(`/exercises/${id}`, {
      method: 'DELETE',
    });
  }

  async getExerciseCategories() {
    return this.request('/exercises/meta/categories');
  }

  async getMuscleGroups() {
    return this.request('/exercises/meta/muscles');
  }

  async getEquipmentTypes() {
    return this.request('/exercises/meta/equipment');
  }

  // Workout session endpoints
  async getSessions(params?: { page?: number; limit?: number; status?: string; startDate?: string; endDate?: string }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/sessions${queryString}`);
  }

  async getSession(id: string) {
    return this.request(`/sessions/${id}`);
  }

  async startSession(sessionData: any) {
    return this.request('/sessions/start', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async updateSession(id: string, sessionData: any) {
    return this.request(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    });
  }

  async completeSession(id: string, data?: { rating?: number; notes?: string }) {
    return this.request(`/sessions/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify(data || {}),
    });
  }

  async cancelSession(id: string) {
    return this.request(`/sessions/${id}/cancel`, {
      method: 'POST',
    });
  }

  async deleteSession(id: string) {
    return this.request(`/sessions/${id}`, {
      method: 'DELETE',
    });
  }

  async getWorkoutStats(period?: string) {
    const queryString = period ? `?period=${period}` : '';
    return this.request(`/sessions/stats/summary${queryString}`);
  }

  // Progress endpoints
  async getProgressEntries(params?: { page?: number; limit?: number; startDate?: string; endDate?: string }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/progress${queryString}`);
  }

  async getProgressEntry(id: string) {
    return this.request(`/progress/${id}`);
  }

  async createProgressEntry(progressData: any) {
    return this.request('/progress', {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  }

  async updateProgressEntry(id: string, progressData: any) {
    return this.request(`/progress/${id}`, {
      method: 'PUT',
      body: JSON.stringify(progressData),
    });
  }

  async deleteProgressEntry(id: string) {
    return this.request(`/progress/${id}`, {
      method: 'DELETE',
    });
  }

  async getProgressDashboard(period?: string) {
    const queryString = period ? `?period=${period}` : '';
    return this.request(`/progress/dashboard${queryString}`);
  }

  async getWeightHistory(period?: string) {
    const queryString = period ? `?period=${period}` : '';
    return this.request(`/progress/weight-history${queryString}`);
  }
}

export const api = new ApiService();
