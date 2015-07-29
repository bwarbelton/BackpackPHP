DROP PROCEDURE IF EXISTS `getAllChildren`;
DELIMITER $$
CREATE PROCEDURE `getAllChildren`()
BEGIN
                SELECT `child_id`, `first_name`, `last_name`, `backpack`, `healthCheck`, `haircut`
    FROM `child`
                ORDER BY `last_name`, `first_name`;
END$$
DELIMITER ;
 
DROP PROCEDURE IF EXISTS `getChild`;
DELIMITER $$
CREATE PROCEDURE `getChild`(IN childId INT)
BEGIN
                SELECT `child_id`, `first_name`, `last_name`, `backpack`, `healthCheck`, `haircut` FROM `child`
    WHERE `child_id` = childId;
END$$
DELIMITER ;
 
 
DROP PROCEDURE IF EXISTS `insertChild`;
DELIMITER $$
CREATE PROCEDURE `insertChild`(
INOUT childId INTEGER,
IN firstName varchar(254),
IN lastName varchar(254),
IN backpackReceived tinyint(1),
IN healthCheckReceived tinyint(1),
IN haircutReceived tinyint(1)
)
BEGIN
                DECLARE EXIT HANDLER FOR SQLEXCEPTION
                                SET childId = -1;
                INSERT INTO child (child_id, first_name, last_name, backpack, healthCheck, haircut)
                VALUES (childId,  firstName,  lastName, backpackReceived, healthCheckReceived, haircutReceived);
END$$
DELIMITER ;
 
 
 
DROP PROCEDURE IF EXISTS `updateChild`;
DELIMITER $$
CREATE PROCEDURE `updateChild`(
IN childId INTEGER,
IN firstName varchar(254),
IN lastName varchar(254),
IN backpackReceived tinyint(1),
IN healthCheckReceived tinyint(1),
IN haircutReceived tinyint(1)
)
BEGIN
                UPDATE child SET first_name=firstName, last_name=lastName, backpack = backpackReceived, healthCheck = healthCheckReceived, haircut = haircutReceived
    WHERE child_id = childId;
END$$
DELIMITER ;
 
