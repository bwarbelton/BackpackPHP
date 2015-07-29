CREATE TABLE `child` (
  `child_id` int(11) NOT NULL,
  `first_name` varchar(254) DEFAULT NULL,
  `last_name` varchar(254) DEFAULT NULL,
  `backpack` tinyint(1) NOT NULL DEFAULT '0',
  `healthCheck` tinyint(1) NOT NULL DEFAULT '0',
  `haircut` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`child_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8; 
