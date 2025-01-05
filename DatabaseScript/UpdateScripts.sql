

ALTER TABLE `zof_mrp`.`orders` 
ADD COLUMN `OrderPriority` INT NULL AFTER `UpdatedBy`;

ALTER TABLE `zof_mrp`.`orderitems` 
ADD COLUMN `OrderItemPriority` INT NULL AFTER `UpdatedBy`;

UPDATE `zof_mrp`.`productcutoptions`
SET

`OptionProductCutOptions` = 'Raglan'
WHERE `Id` = 4;
