const BAD_REQUEST = "BAD_REQUEST"
const NOT_FOUND = "NOT_FOUND"
const UNAUTHORIZED = "UNAUTHORIZED"
const FORBIDDEN = "FORBIDDEN"
const INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"
const SLOT_NOT_AVAILABLE = "SLOT_NOT_AVAILABLE"
const NOT_ACCEPTING_NEW_USER = "NOT_ACCEPTING_NEW_USER"
const FAILED_TO_SAVE_CONSULTATION_SESSION = "FAILED_TO_SAVE_CONSULTATION_SESSION"
const PAYMENT_METHOD_NOT_SUPPORTED = "PAYMENT_METHOD_NOT_SUPPORTED"



export class BadRequestError extends Error {
   readonly _tag = BAD_REQUEST
}

export class NotFoundError extends Error {
   readonly _tag = NOT_FOUND
}

export class UnauthorizedError extends Error {
   readonly _tag = UNAUTHORIZED
}

export class ForbiddenError extends Error {
   readonly _tag = FORBIDDEN
}

export class InternalServerError extends Error {
   readonly _tag = INTERNAL_SERVER_ERROR
}

export class SlotNotAvailableError extends Error {
   readonly _tag = SLOT_NOT_AVAILABLE
}

export class NotAcceptingNewUserError extends Error {
   readonly _tag = NOT_ACCEPTING_NEW_USER
}

export class FailedToSaveConsultationSessionError extends Error {
   readonly _tag = FAILED_TO_SAVE_CONSULTATION_SESSION
}

export class PaymentMethodNotSupportedError extends Error {
   readonly _tag = PAYMENT_METHOD_NOT_SUPPORTED
}