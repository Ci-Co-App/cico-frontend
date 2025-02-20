const configDev = {
  authentication:
    process.env.NEXT_PUBLIC_AUTHENTICATION_API_URL || "MISSING_ENV_VAR",
  admin: process.env.NEXT_PUBLIC_ADMIN_API_URL || "MISSING_ENV_VAR",
  employee: process.env.NEXT_PUBLIC_EMPLOYEE_API_URL || "MISSING_ENV_VAR",
};

export default configDev;
