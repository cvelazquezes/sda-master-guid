/**
 * Spanish Translations
 * Traducciones al español para la app SDA Master Guide
 */

import { TranslationKeys } from './en';

export const es: TranslationKeys = {
  // Común
  common: {
    error: 'Error',
    success: 'Éxito',
    warning: 'Advertencia',
    info: 'Información',
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    ok: 'OK',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    add: 'Agregar',
    submit: 'Enviar',
    retry: 'Reintentar',
    close: 'Cerrar',
    loading: 'Cargando...',
    pleaseWait: 'Por favor espera...',
    noData: 'No hay datos disponibles',
    noResults: 'No se encontraron resultados',
  },

  // Autenticación
  auth: {
    login: 'Iniciar Sesión',
    logout: 'Cerrar Sesión',
    register: 'Registrarse',
    loginFailed: 'Error al Iniciar Sesión',
    loginSuccess: 'Inicio de Sesión Exitoso',
    registrationFailed: 'Error en el Registro',
    registrationSuccess: 'Registro exitoso',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    fullName: 'Nombre Completo',
    whatsappNumber: 'Número de WhatsApp (ej., +1 555 123 4567)',
    enterEmail: 'Ingresa tu correo electrónico',
    enterPassword: 'Ingresa tu contraseña',
    forgotPassword: '¿Olvidaste tu contraseña?',
    noAccount: '¿No tienes una cuenta?',
    haveAccount: '¿Ya tienes una cuenta?',
    signIn: 'Iniciar Sesión',
    signUp: 'Registrarse',
  },

  // Errores
  errors: {
    failedToLoadData: 'Error al cargar datos',
    failedToLoadClubs: 'Error al cargar clubes',
    failedToLoadMembers: 'Error al cargar miembros',
    missingFields: 'Por favor completa todos los campos',
    missingRequiredFields: 'Por favor completa todos los campos requeridos',
    missingClubSelection: 'Por favor completa todos los campos incluyendo la selección del club',
    missingClassSelection: 'Por favor selecciona al menos una clase de Conquistadores',
    passwordMismatch: 'Las contraseñas no coinciden',
    passwordTooShort: 'La contraseña debe tener al menos 6 caracteres',
    invalidEmail: 'Por favor ingresa un correo electrónico válido',
    invalidWhatsapp: 'Por favor ingresa un número de WhatsApp válido con código de país (ej., +1 555 123 4567)',
    invalidAmount: 'Por favor ingresa una cantidad válida',
    missingDescription: 'Por favor ingresa una descripción',
    missingDate: 'Por favor ingresa una fecha de vencimiento',
    invalidDateFormat: 'Por favor usa el formato AAAA-MM-DD (ej., 2025-12-31)',
    noMembersSelected: 'Por favor selecciona al menos un miembro o elige "Todos los Miembros"',
    somethingWentWrong: 'Algo salió mal. Por favor intenta de nuevo.',
    networkError: 'Error de red. Por favor verifica tu conexión.',
  },

  // Mensajes de Éxito
  success: {
    changesSaved: 'Cambios guardados exitosamente',
    actionCompleted: 'Acción completada exitosamente',
    userApproved: 'Usuario aprobado exitosamente',
    userRejected: 'Usuario rechazado',
    userUpdated: 'Usuario actualizado exitosamente',
    clubCreated: 'Club creado exitosamente',
    clubUpdated: 'Club actualizado exitosamente',
    chargeCreated: 'Cargo creado exitosamente',
    paymentRecorded: 'Pago registrado exitosamente',
  },

  // Advertencias
  warnings: {
    unsavedChanges: 'Tienes cambios sin guardar',
    confirmDelete: '¿Estás seguro de que deseas eliminar?',
    confirmAction: '¿Estás seguro de que deseas continuar?',
    accountInactive: 'Tu cuenta está inactiva',
  },

  // Marcadores de posición
  placeholders: {
    search: 'Buscar...',
    searchUsers: 'Buscar usuarios...',
    searchClubs: 'Buscar clubes...',
    searchMembers: 'Buscar miembros...',
    selectOption: 'Selecciona una opción',
    enterAmount: 'Ingresa la cantidad',
    enterClubName: 'Ingresa el nombre del club',
    enterClubDescription: 'Ingresa la descripción del club',
    enterDivision: 'Ingresa la división',
    enterUnion: 'Ingresa la unión',
    enterAssociation: 'Ingresa la asociación',
    enterChurchName: 'Ingresa el nombre de la iglesia',
    enterGroupSize: 'Ingresa el tamaño del grupo',
  },

  // Navegación
  navigation: {
    home: 'Inicio',
    activities: 'Actividades',
    members: 'Miembros',
    settings: 'Configuración',
    dashboard: 'Panel',
    meetings: 'Reuniones',
    finances: 'Finanzas',
    more: 'Más',
  },

  // Configuración
  settings: {
    title: 'Configuración',
    language: 'Idioma',
    theme: 'Tema',
    darkMode: 'Modo Oscuro',
    lightMode: 'Modo Claro',
    systemDefault: 'Predeterminado del Sistema',
    notifications: 'Notificaciones',
    privacy: 'Privacidad',
    about: 'Acerca de',
    version: 'Versión',
    accountSettings: 'Configuración de Cuenta',
    appSettings: 'Configuración de la App',
  },

  // Gestión de Clubes
  club: {
    clubs: 'Clubes',
    createClub: 'Crear Club',
    editClub: 'Editar Club',
    clubName: 'Nombre del Club',
    clubDescription: 'Descripción',
    members: 'Miembros',
    activities: 'Actividades',
    fees: 'Cuotas',
    directive: 'Directiva',
    settings: 'Configuración del Club',
  },

  // Gestión de Usuarios
  users: {
    users: 'Usuarios',
    activeUsers: 'Usuarios Activos',
    pendingUsers: 'Usuarios Pendientes',
    approveUser: 'Aprobar Usuario',
    rejectUser: 'Rechazar Usuario',
    deleteUser: 'Eliminar Usuario',
    editUser: 'Editar Usuario',
    role: 'Rol',
    status: 'Estado',
  },

  // Cuotas
  fees: {
    fees: 'Cuotas',
    myFees: 'Mis Cuotas',
    clubFees: 'Cuotas del Club',
    monthlyFee: 'Cuota Mensual',
    customCharge: 'Cargo Personalizado',
    amount: 'Cantidad',
    dueDate: 'Fecha de Vencimiento',
    paid: 'Pagado',
    pending: 'Pendiente',
    overdue: 'Vencido',
  },
};

