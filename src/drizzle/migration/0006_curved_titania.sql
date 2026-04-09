CREATE TABLE `favorite_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`applicant_id` int NOT NULL,
	`job_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorite_jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `job_alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`applicant_id` int NOT NULL,
	`keywords` varchar(255),
	`location` varchar(255),
	`job_type` enum('remote','hybrid','on-site'),
	`work_type` enum('full-time','part-time','contract','temporary','freelance'),
	`min_salary` int,
	`max_salary` int,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `job_alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `favorite_jobs` ADD CONSTRAINT `favorite_jobs_applicant_id_applicants_id_fk` FOREIGN KEY (`applicant_id`) REFERENCES `applicants`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `favorite_jobs` ADD CONSTRAINT `favorite_jobs_job_id_jobs_id_fk` FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `job_alerts` ADD CONSTRAINT `job_alerts_applicant_id_applicants_id_fk` FOREIGN KEY (`applicant_id`) REFERENCES `applicants`(`id`) ON DELETE cascade ON UPDATE no action;