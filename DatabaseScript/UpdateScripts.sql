

ALTER TABLE `zof_mrp`.`orders` 
ADD COLUMN `OrderPriority` INT NULL AFTER `UpdatedBy`;

ALTER TABLE `zof_mrp`.`orderitems` 
ADD COLUMN `OrderItemPriority` INT NULL AFTER `UpdatedBy`;