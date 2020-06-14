


CREATE TABLE IF NOT EXISTS `students` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,	
  `email` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `profile_img` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `STUDENTS_USERNAME` (`user_name`)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS  `faculties` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `user_name` varchar(255) NOT NULL,	
  `email` varchar(255) DEFAULT NULL,
  `profile_img` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `FACULTIES_USERNAME` (`user_name`)
) ENGINE=InnoDB;


CREATE TABLE IF NOT EXISTS  `subjects` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,	
  `desc` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `SUBJECTS_NAME` (`name`)
) ENGINE=InnoDB;



CREATE TABLE IF NOT EXISTS  `student_subjects` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `student_id`  bigint(20) NOT NULL,	
  `subject_id`  bigint(20) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`student_id`) REFERENCES students(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;



CREATE TABLE IF NOT EXISTS `faculty_subjects` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `faculty_id`  bigint(20) NOT NULL,	
  `subject_id`  bigint(20) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`faculty_id`) REFERENCES faculties(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

