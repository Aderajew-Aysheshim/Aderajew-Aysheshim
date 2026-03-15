import { useAuth } from '../context/AuthContext';

// Permission levels
export const PERMISSIONS = {
  // Student permissions
  VIEW_DASHBOARD: 'view_dashboard',
  TAKE_EXAMS: 'take_exams',
  VIEW_RESOURCES: 'view_resources',
  MESSAGE_TUTORS: 'message_tutors',
  MANAGE_PROFILE: 'manage_profile',
  
  // Tutor permissions
  MANAGE_COURSES: 'manage_courses',
  UPLOAD_RESOURCES: 'upload_resources',
  VIEW_STUDENT_MESSAGES: 'view_student_messages',
  MANAGE_TUTOR_PROFILE: 'manage_tutor_profile',
  
  // Admin permissions
  MANAGE_USERS: 'manage_users',
  MANAGE_EXAMS: 'manage_exams',
  MANAGE_RESOURCES_ADMIN: 'manage_resources_admin',
  VIEW_ANALYTICS: 'view_analytics',
  SYSTEM_SETTINGS: 'system_settings',
  VERIFY_TUTORS: 'verify_tutors',
  MANAGE_PAYMENTS: 'manage_payments'
};

// Role-based permission mapping
const ROLE_PERMISSIONS = {
  student: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.TAKE_EXAMS,
    PERMISSIONS.VIEW_RESOURCES,
    PERMISSIONS.MESSAGE_TUTORS,
    PERMISSIONS.MANAGE_PROFILE
  ],
  tutor: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_RESOURCES,
    PERMISSIONS.MANAGE_COURSES,
    PERMISSIONS.UPLOAD_RESOURCES,
    PERMISSIONS.VIEW_STUDENT_MESSAGES,
    PERMISSIONS.MANAGE_TUTOR_PROFILE,
    PERMISSIONS.MANAGE_PROFILE
  ],
  admin: Object.values(PERMISSIONS) // Admin has all permissions
};

// Custom hook for checking permissions
export const usePermissions = () => {
  const { userType, user } = useAuth();

  // Check if user has a specific permission
  const hasPermission = (permission) => {
    if (!userType) return false;
    
    const userPermissions = ROLE_PERMISSIONS[userType] || [];
    return userPermissions.includes(permission);
  };

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions) => {
    if (!Array.isArray(permissions)) return hasPermission(permissions);
    return permissions.some(permission => hasPermission(permission));
  };

  // Check if user has all specified permissions
  const hasAllPermissions = (permissions) => {
    if (!Array.isArray(permissions)) return hasPermission(permissions);
    return permissions.every(permission => hasPermission(permission));
  };

  // Check if user can access a specific route/feature
  const canAccess = (feature) => {
    const featurePermissions = {
      'dashboard': [PERMISSIONS.VIEW_DASHBOARD],
      'exams': [PERMISSIONS.TAKE_EXAMS, PERMISSIONS.MANAGE_EXAMS],
      'resources': [PERMISSIONS.VIEW_RESOURCES, PERMISSIONS.UPLOAD_RESOURCES, PERMISSIONS.MANAGE_RESOURCES_ADMIN],
      'messages': [PERMISSIONS.MESSAGE_TUTORS, PERMISSIONS.VIEW_STUDENT_MESSAGES],
      'profile': [PERMISSIONS.MANAGE_PROFILE, PERMISSIONS.MANAGE_TUTOR_PROFILE],
      'admin_panel': [PERMISSIONS.MANAGE_USERS, PERMISSIONS.SYSTEM_SETTINGS],
      'exam_management': [PERMISSIONS.MANAGE_EXAMS],
      'user_management': [PERMISSIONS.MANAGE_USERS],
      'payment_verification': [PERMISSIONS.MANAGE_PAYMENTS],
      'tutor_verification': [PERMISSIONS.VERIFY_TUTORS],
      'analytics': [PERMISSIONS.VIEW_ANALYTICS]
    };

    const requiredPermissions = featurePermissions[feature];
    if (!requiredPermissions) return true; // Allow access if feature is not restricted
    
    return hasAnyPermission(requiredPermissions);
  };

  // Get user's role level for hierarchical checks
  const getRoleLevel = () => {
    const roleLevels = {
      student: 1,
      tutor: 2,
      admin: 3
    };
    return roleLevels[userType] || 0;
  };

  // Check if user has higher or equal role level
  const hasRoleLevel = (minimumLevel) => {
    return getRoleLevel() >= minimumLevel;
  };

  // Check if user can perform action on specific resource
  const canPerformAction = (action, resource, resourceOwner = null) => {
    // Admin can do everything
    if (userType === 'admin') return true;

    // Check ownership for certain actions
    if (resourceOwner && user?.id) {
      const isOwner = user.id === resourceOwner;
      
      switch (action) {
        case 'view':
          return isOwner || hasPermission(`view_${resource}`);
        case 'edit':
          return isOwner || hasPermission(`edit_${resource}`);
        case 'delete':
          return isOwner || hasPermission(`delete_${resource}`);
        default:
          return hasPermission(`${action}_${resource}`);
      }
    }

    return hasPermission(`${action}_${resource}`);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
    getRoleLevel,
    hasRoleLevel,
    canPerformAction,
    permissions: ROLE_PERMISSIONS[userType] || [],
    userType
  };
};

export default usePermissions;
