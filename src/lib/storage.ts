// Local storage utilities for the poll app
export interface User {
  rollNumber: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export interface Poll {
  id: string;
  question: string;
  options: string[];
  createdAt: string;
}

export interface Response {
  pollId: string;
  rollNumber: string;
  option: string;
  submittedAt: string;
}

// Initialize default data
export const initializeData = () => {
  // Check if data already exists
  if (localStorage.getItem('pollApp_users')) {
    return;
  }

  // Create 60 student accounts + 1 tutor
  const users: User[] = [
    {
      rollNumber: 'tutor',
      name: 'Tutor',
      email: 'tutor@skct.edu.in',
      password: 'admin123',
      isAdmin: true,
    },
  ];

  // Add 60 students with college email format (excluding 727824TUAM002)
  for (let i = 1; i <= 61; i++) {
    if (i === 2) continue; // Skip discontinued roll number 002
    
    const rollNum = i.toString().padStart(3, '0');
    const email = `727824TUAM${rollNum}@skct.edu.in`;
    
    users.push({
      rollNumber: `727824TUAM${rollNum}`,
      name: `Student ${rollNum}`,
      email: email,
      password: 'student123', // Default password for all students
      isAdmin: false,
    });
  }

  // Store initial data
  localStorage.setItem('pollApp_users', JSON.stringify(users));
  localStorage.setItem('pollApp_polls', JSON.stringify([]));
  localStorage.setItem('pollApp_responses', JSON.stringify([]));
};

// User management
export const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem('pollApp_users') || '[]');
};

export const authenticateUser = (emailOrRollNumber: string, password: string): User | null => {
  const users = getUsers();
  // Allow authentication with either email or roll number
  return users.find(user => 
    (user.email === emailOrRollNumber || user.rollNumber === emailOrRollNumber) && 
    user.password === password
  ) || null;
};

// Poll management
export const getPolls = (): Poll[] => {
  return JSON.parse(localStorage.getItem('pollApp_polls') || '[]');
};

export const savePoll = (poll: Omit<Poll, 'id'>): Poll => {
  const polls = getPolls();
  const newPoll: Poll = {
    ...poll,
    id: crypto.randomUUID ? crypto.randomUUID() : `poll-${Date.now()}`,
  };
  polls.push(newPoll);
  localStorage.setItem('pollApp_polls', JSON.stringify(polls));
  return newPoll;
};

export const deletePoll = (pollId: string): void => {
  const polls = getPolls().filter(poll => poll.id !== pollId);
  const responses = getResponses().filter(response => response.pollId !== pollId);
  localStorage.setItem('pollApp_polls', JSON.stringify(polls));
  localStorage.setItem('pollApp_responses', JSON.stringify(responses));
};

// Response management
export const getResponses = (): Response[] => {
  return JSON.parse(localStorage.getItem('pollApp_responses') || '[]');
};

export const saveResponse = (response: Omit<Response, 'submittedAt'>): void => {
  const responses = getResponses();
  const newResponse: Response = {
    ...response,
    submittedAt: new Date().toISOString(),
  };
  responses.push(newResponse);
  localStorage.setItem('pollApp_responses', JSON.stringify(responses));
};

export const hasUserResponded = (pollId: string, rollNumber: string): boolean => {
  const responses = getResponses();
  return responses.some(response => response.pollId === pollId && response.rollNumber === rollNumber);
};

export const getPollResponses = (pollId: string): Response[] => {
  return getResponses().filter(response => response.pollId === pollId);
};