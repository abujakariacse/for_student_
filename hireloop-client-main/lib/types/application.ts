// Shared job-application types — the "Apply" button writes this shape, the
// seeker "My Applications" table (/dashboard/seeker/applications) reads it.
// Fields follow the requirements spec columns: Job Title, Company,
// Date Applied, Status — plus the applicant identity that scopes each row.

export type ApplicationStatus =
  | "Applied"
  | "Under Review"
  | "Shortlisted"
  | "Rejected"
  | "Offered";

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Rejected",
  "Offered",
];

/** One submitted application, as stored in the `applications` collection. */
export interface Application {
  _id: string;
  jobId: string;
  jobRef: string;
  jobTitle: string;
  companyName: string;
  location: string;
  jobType?: string;
  workplaceType?: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  resumeUrl: string;
  coverLetter: string;

  status: ApplicationStatus;

  dateApplied: string;
}

/** Payload the client sends when applying — the server owns the rest. */
export interface ApplicationInput {
  jobId: string;
  jobRef: string;
  jobTitle: string;
  companyName: string;
  location: string;
  jobType?: string;
  workplaceType?: string;

  applicantId: string;
  applicantName: string;
  applicantEmail: string;

  resumeUrl?: string;
  coverLetter?: string;
}
