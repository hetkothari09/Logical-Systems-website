export const adminCredentials = {
  email: 'admin@logicalsystems.com',
  password: 'admin123'
};

export const employeeCredentials = {
  email: 'employee@logicalsystems.com',
  password: 'emp123'
};

export const authenticateAdmin = (email, password) => {
  return email === adminCredentials.email && password === adminCredentials.password;
};

export const authenticateEmployee = (email, password) => {
  return email === employeeCredentials.email && password === employeeCredentials.password;
}; 