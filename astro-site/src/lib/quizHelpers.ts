export type QuizStatus = "not-started" | "available" | "planned";

export function describeQuizStatus(status: QuizStatus) {
  if (status === "available") return "Available";
  if (status === "planned") return "Planned";
  return "Ready to begin";
}
