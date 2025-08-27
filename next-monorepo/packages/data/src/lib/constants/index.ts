export const awesomeappDisciplines = ["support worker", "clinical psychologist", "general psychologist", "counsellor"] as const;

export const CONSULTATION_SESSION_DURATION = 60;

export const POSTHOG_AWESOMEAPP_APP_MEMBERS = "members";
export const POSTHOG_AWESOMEAPP_APP_CLINICIANS = "clinicians";
export const POSTHOG_AWESOMEAPP_APP_BACK_OFFICE = "back-office";

export const UNLIMITED_REDEMPTIONS = -1;

export const AGE_BRACKET_MAX_AGE = 9999;

export const DEFAULT_TIME_ZONE = "UTC";
export const BEGINING_OF_TIME = "1970-01-01T00:00:00.000Z";
export const END_OF_TIME = "2500-01-01T00:00:00.000Z";

export const PAYMENT_METHODS = ["card", "eap", "medicare-gap", "medicare-bulk", "allianz"];
export const MEDICARE_PAYMENT_METHODS = ["medicare-gap", "medicare-bulk"];
export const REQUIRE_CARD_PAYMENT_METHODS = ["medicare-gap", "card", "allianz"];

export const MINIMUM_BOOKING_PERIOD_HOURS = 4;

export const FORBIDDEN_COUNSELLOR_PAYMENT_METHODS = ["medicare-gap", "medicare-bulk", "allianz"];

export const CRITICAL_INCIDENT_PRESENTING_REASONS = [
  "Workplace accident",
  "Natural disasters",
  "Customer violence and aggression",
  "Armed robbery",
  "Attempted suicide in the workplace",
  "Workplace suicide",
  "Death of employee in the workplace",
  "Death of employee outside the workplace",
  "Workplace bullying and harassment",
  "Mental health crisis",
  "Sexual assault",
  "Vicarious trauma",
  "Violence, workplace conflict or fights",
  "Serious illness or diagnosis of a colleague",
  "Workplace performance issues",
  "Communication and conflict",
  "Workload and work life balance",
  "Supporting at risk employees",
  "workplace dynamics",
  "Achievement and goal setting",
  "skills development",
] as const;

export const CRITICAL_INCIDENT_SEVERITY_LEVELS = ["low", "medium", "high"] as const
export const CRITICAL_INCIDENT_NUMBER_OF_STAFF_GROUPPING = ["0-10", "11-50", "51-100", "101+"] as const
export const CRITICAL_INCIDENT_CLINICAL_DELIVERIES = ["partner-provider", "awesomeapp-internal", "hybrid"] as const
export const CRITICAL_INCIDENT_STATUS = ["booked", "completed", "cancelled"] as const