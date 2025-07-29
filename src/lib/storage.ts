export interface User {
  rollNumber: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  hasCompletedSetup?: boolean;
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

// Expanded list of sample first and last names for generating unique student names
const firstNames = [
  'Arun', 'Bhavya', 'Chitra', 'Deepak', 'Esha', 'Farhan', 'Gita', 'Harish', 'Indira', 'Jagan',
  'Kavya', 'Lakshmi', 'Mohan', 'Nisha', 'Pranav', 'Rekha', 'Sanjay', 'Tara', 'Vikram', 'Yash',
  'Anjali', 'Bharat', 'Divya', 'Gautam', 'Hema', 'Ishaan', 'Jyoti', 'Kiran', 'Meera', 'Naveen'
];

const lastNames = [
  'Kumar', 'Sharma', 'Patel', 'Verma', 'Gupta', 'Nair', 'Reddy', 'Singh', 'Mehta', 'Joshi',
  'Bose', 'Chopra', 'Das', 'Iyer', 'Kapoor', 'Malhotra', 'Menon', 'Pandey', 'Rao', 'Saxena',
  'Agarwal', 'Bhat', 'Chauhan', 'Desai', 'Jain', 'Mishra', 'Pillai', 'Shah', 'Thakur', 'Yadav'
];

// Common password for all students on first login
const COMMON_STUDENT_PASSWORD = 'AIML@2025';

// Initialize default data
export const initializeData = () => {
  if (localStorage.getItem('pollApp_users')) {
    return;
  }

  const users: User[] = [
    {
      rollNumber: 'tutor',
      name: 'Tutor',
      email: 'tutor@skct.edu.in',
      password: 'admin123',
      isAdmin: true,
    },
  ];

  const usedNames = new Set<string>();

  for (let i = 1; i <= 61; i++) {
    if (i === 2) continue;
    
    const rollNum = i.toString().padStart(3, '0');
    const rollNumber = `727824TUAM${rollNum}`;
    const email = `727824TUAM${rollNum}@skct.edu.in`;
    
    let name: string;
    do {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      name = `${firstName} ${lastName}`;
    } while (usedNames.has(name));
    
    usedNames.add(name);

    const student = {
      rollNumber,
      name: `Student ${rollNumber}`, // Temporary name until first login
      email,
      password: COMMON_STUDENT_PASSWORD,
      isAdmin: false,
      hasCompletedSetup: false,
    };

    console.log('Creating student:', student);
    users.push(student);
  }

  console.log('Total users created:', users.length);
  console.log('Students created:', users.filter(u => !u.isAdmin).length);
  
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
  console.log('Attempting to authenticate:', emailOrRollNumber, 'with password:', password);
  console.log('Available users:', users.map(u => ({ rollNumber: u.rollNumber, email: u.email, password: u.password })));
  
  const user = users.find(user => 
    (user.email === emailOrRollNumber || user.rollNumber === emailOrRollNumber) && 
    user.password === password
  );
  
  console.log('Authentication result:', user ? 'SUCCESS' : 'FAILED');
  return user || null;
};

export const updateUserPassword = (rollNumber: string, currentPassword: string, newPassword: string): boolean => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.rollNumber === rollNumber && user.password === currentPassword);
  if (userIndex === -1) return false;
  
  users[userIndex].password = newPassword;
  localStorage.setItem('pollApp_users', JSON.stringify(users));
  return true;
};

export const completeUserSetup = (rollNumber: string, name: string, newPassword: string): boolean => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.rollNumber === rollNumber);
  if (userIndex === -1) return false;
  
  users[userIndex].name = name;
  users[userIndex].password = newPassword;
  users[userIndex].hasCompletedSetup = true;
  localStorage.setItem('pollApp_users', JSON.stringify(users));
  
  // Update current user in localStorage
  const currentUser = JSON.parse(localStorage.getItem('pollApp_currentUser') || '{}');
  if (currentUser.rollNumber === rollNumber) {
    localStorage.setItem('pollApp_currentUser', JSON.stringify(users[userIndex]));
  }
  
  return true;
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
