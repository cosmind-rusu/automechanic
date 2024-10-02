export enum UserRole {

    EMPLEADO = 'EMPLEADO',
    PRACTICAS = 'PRACTICAS',
    APRENDIZ = 'APRENDIZ',
    MECANICO = 'MECANICO',
    JEFE_MECANICO = 'JEFE_MECANICO',
  }
  
  export const roleAccess = {

    [UserRole.EMPLEADO]: ['dashboard', 'inventory', 'distributors', 'vehicles'],
    [UserRole.PRACTICAS]: ['dashboard', 'inventory', 'distributors', 'vehicles'],
    [UserRole.APRENDIZ]: ['dashboard', 'inventory', 'distributors', 'vehicles'],
    [UserRole.MECANICO]: ['dashboard', 'inventory', 'distributors', 'vehicles'],
    [UserRole.JEFE_MECANICO]: ['dashboard', 'inventory', 'distributors', 'employe', 'vehicles'],

  };
  
  export const hasAccess = (role: UserRole, page: string): boolean => {
    return roleAccess[role]?.includes(page) || false;
  };