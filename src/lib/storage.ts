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

// Predefined passwords for each student (excluding 727824TUAM002)
const studentPasswords: { [rollNumber: string]: string } = {
  '727824TUAM001': 'Pass001#Skct',
  '727824TUAM003': 'Pass003#Skct',
  '727824TUAM004': 'Pass004#Skct',
  '727824TUAM005': 'Pass005#Skct',
  '727824TUAM006': 'Pass006#Skct',
  '727824TUAM007': 'Pass007#Skct',
  '727824TUAM008': 'Pass008#Skct',
  '727824TUAM009': 'Pass009#Skct',
  '727824TUAM010': 'Pass010#Skct',
  '727824TUAM011': 'Pass011#Skct',
  '727824TUAM012': 'Pass012#Skct',
  '727824TUAM013': 'Pass013#Skct',
  '727824TUAM014': 'Pass014#Skct',
  '727824TUAM015': 'Pass015#Skct',
  '727824TUAM016': 'Pass016#Skct',
  '727824TUAM017': 'Pass017#Skct',
  '727824TUAM018': 'Pass018#Skct',
  '727824TUAM019': 'Pass019#Skct',
  '727824TUAM020': 'Pass020#Skct',
  '727824TUAM021': 'Pass021#Skct',
  '727824TUAM022': 'Pass022#Skct',
  '727824TUAM023': 'Pass023#Skct',
  '727824TUAM024': 'Pass024#Skct',
  '727824TUAM025': 'Pass025#Skct',
  '727824TUAM026': 'Pass026#Skct',
  '727824TUAM027': 'Pass027#Skct',
  '727824TUAM028': 'Pass028#Skct',
  '727824TUAM029': 'Pass029#Skct',
  '727824TUAM030': 'Pass030#Skct',
  '727824TUAM031': 'Pass031#Skct',
  '727824TUAM032': 'Pass032#Skct',
  '727824TUAM033': 'Pass033#Skct',
  '727824TUAM034': 'Pass034#Skct',
  '727824TUAM035': 'Pass035#Skct',
  '727824TUAM036': 'Pass036#Skct',
  '727824TUAM037': 'Pass037#Skct',
  '727824TUAM038': 'Pass038#Skct',
  '727824TUAM039': 'Pass039#Skct',
  '727824TUAM040': 'Pass040#Skct',
  '727824TUAM041': 'Pass041#Skct',
  '727824TUAM042': 'Pass042#Skct',
  '727824TUAM043': 'Pass043#Skct',
  '727824TUAM044': 'Pass044#Skct',
  '727824TUAM045': 'Pass045#Skct',
  '727824TUAM046': 'Pass046#Skct',
  '727824TUAM047': 'Pass047#Skct',
  '727824TUAM048': 'Pass048#Skct',
  '727824TUAM049': 'Pass049#Skct',
  '727824TUAM050': 'Pass050#Skct',
  '727824TUAM051': 'Pass051#Skct',
  '727824TUAM052': 'Pass052#Skct',
  '727824TUAM053': 'Pass053#Skct',
  '727824TUAM054': 'Pass054#Skct',
  '727824TUAM055': 'Pass055#Skct',
  '727824TUAM056': 'Pass056#Skct',
  '727824TUAM057': 'Pass057#Skct',
  '727824TUAM058': 'Pass058#Skct',
  '727824TUAM059': 'Pass059#Skct',
  '727824TUAM060': 'Pass060#Skct',
  '727824TUAM061': 'Pass061#Skct',
};

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

    users.push({
      rollNumber,
      name: `Student ${rollNumber}`, // Temporary name until first login
      email,
      password: studentPasswords[rollNumber],
      isAdmin: false,
      hasCompletedSetup: false,
    });
  }

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
  return users.find(user => 
    (user.email === emailOrRollNumber || user.rollNumber === emailOrRollNumber) && 
    user.password === password
  ) || null;
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