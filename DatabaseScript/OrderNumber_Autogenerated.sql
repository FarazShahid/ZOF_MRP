ALTER TABLE Orders
ADD COLUMN OrderNumber VARCHAR(10) NOT NULL UNIQUE;

DELIMITER $$

CREATE TRIGGER GenerateOrderNumber
BEFORE INSERT ON Orders
FOR EACH ROW
BEGIN
    DECLARE prefix VARCHAR(2);
    DECLARE random_number VARCHAR(6);

    -- Extract the first two characters of the client's name as the prefix
    SELECT UPPER(SUBSTRING(Name, 1, 2)) INTO prefix
    FROM Client
    WHERE Id = NEW.ClientId;

    -- Generate a random 6-character alphanumeric string
    SET random_number = CONCAT(
        CHAR(FLOOR(65 + (RAND() * 26))), -- Random uppercase letter
        CHAR(FLOOR(65 + (RAND() * 26))), -- Random uppercase letter
        FLOOR(1000 + (RAND() * 9000))    -- Random 4-digit number
    );

    -- Set the OrderNumber
    SET NEW.OrderNumber = CONCAT(prefix, random_number);
END$$

DELIMITER ;

ALTER TABLE OrderItems
ADD COLUMN OrderItemQuantity INT NOT NULL DEFAULT 1;
ALTER TABLE Orders
ADD COLUMN OrderName VARCHAR(255) NOT NULL;

ALTER TABLE Orders
ADD COLUMN ExternalOrderId VARCHAR(255) DEFAULT NULL;

