export type AppError = {
  code: string;
  message: string;
  status?: number;
};

export function getSafeErrorMessage(status?: number) {
  if (status === 401) {
    return "Please sign in again to continue.";
  }

  if (status === 403) {
    return "You do not have access to this action.";
  }

  if (status === 404) {
    return "We could not find what you were looking for.";
  }

  return "Something went wrong. Please try again.";
}
