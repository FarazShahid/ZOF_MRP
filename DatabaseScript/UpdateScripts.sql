/*ALTER TABLE `zof_mrp`.`orders` 
ADD COLUMN `OrderPriority` INT NULL AFTER `UpdatedBy`;

ALTER TABLE `zof_mrp`.`orderitems` 
ADD COLUMN `OrderItemPriority` INT NULL AFTER `UpdatedBy`;

UPDATE `zof_mrp`.`productcutoptions`
SET

`OptionProductCutOptions` = 'Raglan'
WHERE `Id` = 4; */

-- Disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Truncate tables
TRUNCATE TABLE SizeMeasurements;
TRUNCATE TABLE ProductSizeMeasurements;
TRUNCATE TABLE Product;
TRUNCATE TABLE ProductCategory;
TRUNCATE TABLE FabricType;
TRUNCATE TABLE ProductCutOptions;
TRUNCATE TABLE AvailableColorOptions;
TRUNCATE TABLE SizeOptions;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

INSERT IGNORE INTO ProductCategory (Type, CreatedBy)
VALUES
('T-shirts', 'Admin'),
('Hoodies', 'Admin'),
('Sweatshirts', 'Admin'),
('Tracksuits', 'Admin'),
('Shorts', 'Admin'),
('Trousers', 'Admin'),
('Puffer Jackets', 'Admin'),
('Wool Socks', 'Admin'),
('Polos', 'Admin'),
('Scrubs', 'Admin'),
('Doctor Long Coats', 'Admin');

INSERT IGNORE INTO FabricType (Type, Name, GSM, CreatedBy)
VALUES
('knitwear', 'Interlock160', 160, 'Admin'),
('knitwear', 'Interlock140', 140, 'Admin'),
('knitwear', 'Interlock120', 120, 'Admin'),
('Woven', 'Interlock160', 160, 'Admin'),
('knitwear', 'Interlock180', 180, 'Admin'),
('knitwear', 'Interlock220', 220, 'Admin'),
('knitwear', 'Interlock240', 240, 'Admin'),
('Woven', 'Cotton-Flees320', 320, 'Admin'),
('Woven', 'Cotton-Flees340', 340, 'Admin'),
('Woven', 'Cotton-Flees400', 400, 'Admin'),
('Woven', 'Scuba380', 380, 'Admin'),
('Woven', 'Scuba420', 420, 'Admin'),
('knitwear', 'Scuba-Flees320', 320, 'Admin'),
('knitwear', 'Scuba-Flees340', 340, 'Admin'),
('knitwear', 'Scuba-Flees380', 380, 'Admin'),
('knitwear', 'Poly-Lycra170', 170, 'Admin'),
('knitwear', 'Poly-Lycra206', 206, 'Admin'),
('knitwear', 'Nylon-Lycra180', 180, 'Admin'),
('knitwear', 'Nylon-Lycra200', 200, 'Admin');

INSERT IGNORE INTO ProductCutOptions (OptionProductCutOptions, CreatedBy)
VALUES
('Male', 'Admin'),
('Female', 'Admin'),
('Unisex', 'Admin'),
('EU', 'Admin'),
('US', 'Admin'),
('UK', 'Admin'),
('Raglan', 'Admin');

INSERT IGNORE INTO AvailableColorOptions (ColorName, CreatedBy)
VALUES
('Gray', 'Admin'),
('Black', 'Admin'),
('White', 'Admin');


INSERT IGNORE INTO SizeOptions (OptionSizeOptions, CreatedBy)
VALUES
('XS-UK', 'Admin'),
('S-UK', 'Admin'),
('M-UK', 'Admin'),
('L-UK', 'Admin'),
('XL-UK', 'Admin'),
('2XL-UK', 'Admin'),
('XS-US', 'Admin'),
('S-US', 'Admin'),
('M-US', 'Admin'),
('L-US', 'Admin'),
('XL-US', 'Admin'),
('2XL-US', 'Admin'),
('3XL-US', 'Admin'),
('3XL-UK', 'Admin'),
('4XL-US', 'Admin'),
('4XL-UK', 'Admin'),
('5XL-US', 'Admin'),
('5XL-UK', 'Admin'),
('6XL-US', 'Admin'),
('6XL-UK', 'Admin'),
('4yo-US', 'Admin'),
('4yo-UK', 'Admin'),
('6yo-US', 'Admin'),
('6yo-UK', 'Admin'),
('8yo-US', 'Admin'),
('8yo-UK', 'Admin'),
('12yo-US', 'Admin'),
('12yo-UK', 'Admin');



