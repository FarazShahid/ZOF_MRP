INSERT IGNORE INTO Client (Name, Email, Phone, Country, State, City, CompleteAddress, ClientStatusId, CreatedBy)
VALUES
('Comprehensive Spine Center', 'info@spinecenter.com', '123456789', 'USA', 'California', 'Los Angeles', '123 Health Street', 
(SELECT Id FROM ClientStatus WHERE StatusName = 'Active'), 'Admin'),
('Charlotte Rise FC', 'contact@charlotterisefc.com', '987654321', 'USA', 'North Carolina', 'Charlotte', '456 Sports Avenue', 
(SELECT Id FROM ClientStatus WHERE StatusName = 'Active'), 'Admin');

INSERT IGNORE INTO Product (ProductCategoryId, FabricTypeId, Name, Description, CreatedBy)
SELECT
    pc.Id AS ProductCategoryId,
    ft.Id AS FabricTypeId,
    CONCAT(cut.OptionProductCutOptions, '-', pc.Type, '-', ft.Name, '-Size', so.OptionSizeOptions) AS Name,
    CONCAT('A ', cut.OptionProductCutOptions, ' ', pc.Type, ' made from ', ft.Name, ' fabric with GSM ', ft.GSM, ' in size ', so.OptionSizeOptions) AS Description,
    'Admin'
FROM ProductCategory pc
CROSS JOIN FabricType ft
CROSS JOIN ProductCutOptions cut
CROSS JOIN SizeOptions so;

-- Add colors for Cotton Flees and Scuba fabrics
INSERT IGNORE INTO AvailableColorOptions (ColorName, ProductId, CreatedBy)
SELECT DISTINCT
    'Gray' AS ColorName, p.Id AS ProductId, 'Admin' AS CreatedBy
FROM Product p
JOIN FabricType ft ON p.FabricTypeId = ft.Id
WHERE ft.Name LIKE '%Cotton-Flees%' OR ft.Name LIKE '%Scuba%';

INSERT IGNORE INTO AvailableColorOptions (ColorName, ProductId, CreatedBy)
SELECT DISTINCT
    'Black' AS ColorName, p.Id AS ProductId, 'Admin' AS CreatedBy
FROM Product p
JOIN FabricType ft ON p.FabricTypeId = ft.Id
WHERE ft.Name LIKE '%Cotton-Flees%' OR ft.Name LIKE '%Scuba%';

-- Add White color for all fabrics
INSERT IGNORE INTO AvailableColorOptions (ColorName, ProductId, CreatedBy)
SELECT DISTINCT
    'White' AS ColorName, p.Id AS ProductId, 'Admin' AS CreatedBy
FROM Product p;

-- Create Random Client Events 

INSERT INTO ClientEvent (EventName, Description, CreatedBy)
VALUES
('Winter Soccer League', 'Exciting winter soccer league event.', 'Admin'),
('Best of Best Tryouts', 'Top players tryouts for the best teams.', 'Admin'),
('Indoor Futsals Championship', 'Fast-paced indoor futsal competition.', 'Admin'),
('Summer Football Camp', 'Training camp for aspiring footballers.', 'Admin'),
('Regional Soccer Cup', 'Tournament for regional soccer teams.', 'Admin'),
('All-Star Soccer Weekend', 'Showcase of top soccer talents.', 'Admin'),
('National Soccer Finals', 'Clash of the best teams in the finals.', 'Admin'),
('Youth Football Carnival', 'Fun-filled football event for youth.', 'Admin'),
('Spring Soccer Festival', 'Festival of football and festivities.', 'Admin'),
('Rising Stars Tryouts', 'Tryouts for emerging football talents.', 'Admin');

-- Generate 50 Orders for Each Client
INSERT INTO Orders (ClientId, OrderEventId, Description, OrderStatusId, Deadline, OrderNumber, OrderName, ExternalOrderId, CreatedBy)
SELECT
    c.Id AS ClientId,
    1 AS OrderEventId, -- Replace 1 with the actual valid OrderEventId from ClientEvent
    CONCAT('Order for ', c.Name, ' for product ', p.Name) AS Description,
    (SELECT Id FROM OrderStatus WHERE StatusName = 'Pending') AS OrderStatusId,
    NOW() + INTERVAL FLOOR(1 + (RAND() * 30)) DAY AS Deadline,
    NULL AS OrderNumber,
    CONCAT(c.Name, ' - Order ', FLOOR(1000 + (RAND() * 9000))) AS OrderName,
    CONCAT('EXT-', FLOOR(1000 + (RAND() * 9000))) AS ExternalOrderId,
    'Admin' AS CreatedBy
FROM Product p
CROSS JOIN (SELECT Id, Name FROM Client WHERE Name IN ('Comprehensive Spine Center', 'Charlotte Rise FC')) c
ORDER BY RAND()
LIMIT 100;

INSERT INTO OrderItems (OrderId, ProductId, Description, OrderItemQuantity, CreatedBy)
SELECT
    o.Id AS OrderId,
    p.Id AS ProductId,
    CONCAT('Item for ', o.Description, ' - Product: ', p.Name) AS Description,
    FLOOR(1 + (RAND() * 3)) AS OrderItemQuantity, -- Random quantity between 1 and 3
    'Admin' AS CreatedBy
FROM Orders o
JOIN Product p ON TRUE
ORDER BY RAND()
LIMIT 300; -- Assuming 1–3 items per order for 100 orders

