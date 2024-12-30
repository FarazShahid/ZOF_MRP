-- Table: ClientStatus (Master Table)

Create Database Zof_MRP; 
Use Zof_MRP; 
CREATE TABLE ClientStatus (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    StatusName VARCHAR(255) NOT NULL UNIQUE,
    Description TEXT,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100)
);

-- Table: DocStatus (Master Table)
CREATE TABLE DocStatus (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Status VARCHAR(255) NOT NULL UNIQUE,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100)
);

-- Table: DocType (Master Table)
CREATE TABLE DocType (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Type VARCHAR(255) NOT NULL UNIQUE,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100)
);

-- Table: Document
CREATE TABLE Document (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    PhotoGuid VARCHAR(255) NOT NULL,
    FileName VARCHAR(255) NOT NULL,
    Extension VARCHAR(50) NOT NULL,
    PhysicalPath TEXT,
    CloudPath TEXT,
    DocStatusId INT NOT NULL,
    DocTypeId INT NOT NULL,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100),
    FOREIGN KEY (DocStatusId) REFERENCES DocStatus(Id) ON DELETE RESTRICT,
    FOREIGN KEY (DocTypeId) REFERENCES DocType(Id) ON DELETE RESTRICT
);

-- Table: Client
CREATE TABLE Client (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Phone VARCHAR(20),
    Country VARCHAR(100),
    State VARCHAR(100),
    City VARCHAR(100),
    CompleteAddress TEXT,
    ClientStatusId INT NOT NULL,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100),
    FOREIGN KEY (ClientStatusId) REFERENCES ClientStatus(Id) ON DELETE RESTRICT
);

-- Table: ClientAssociates
CREATE TABLE ClientAssociates (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ClientId INT NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Name VARCHAR(255),
    Phone VARCHAR(20),
    Country VARCHAR(100),
    State VARCHAR(100),
    City VARCHAR(100),
    CompleteAddress TEXT,
    StatusId INT NOT NULL,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100),
    FOREIGN KEY (ClientId) REFERENCES Client(Id) ON DELETE CASCADE,
    FOREIGN KEY (StatusId) REFERENCES ClientStatus(Id) ON DELETE RESTRICT
);

-- Table: ClientEvent (Renamed from Event)
CREATE TABLE ClientEvent (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    EventName VARCHAR(255) NOT NULL UNIQUE,
    Description TEXT,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100)
);

-- Table: OrderStatus (Master Table)
CREATE TABLE OrderStatus (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    StatusName VARCHAR(255) NOT NULL UNIQUE,
    Description TEXT,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100)
);

-- Table: OrderType (Master Table)
CREATE TABLE OrderType (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    TypeName VARCHAR(255) NOT NULL UNIQUE,
    Description TEXT,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100)
);

-- Table: OrderCategory (Master Table)
CREATE TABLE OrderCategory (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(255) NOT NULL UNIQUE,
    Description TEXT,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100)
);

-- Table: ProductCategory (Master Table)
CREATE TABLE ProductCategory (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Type VARCHAR(255) NOT NULL UNIQUE,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100)
);

-- Table: FabricType (Master Table)
CREATE TABLE FabricType (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Type VARCHAR(255) NOT NULL,
    Name VARCHAR(255) NOT NULL,
    GSM INT NOT NULL,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100)
);

-- Table: PrintingOptions (Master Table)
CREATE TABLE PrintingOptions (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Type VARCHAR(255) NOT NULL UNIQUE,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100)
);

-- Table: SizeOptions (Master Table)
CREATE TABLE SizeOptions (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    OptionSizeOptions VARCHAR(255) NOT NULL UNIQUE,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100)
);

-- Table: ProductCutOptions (Master Table)
CREATE TABLE ProductCutOptions (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    OptionProductCutOptions VARCHAR(255) NOT NULL UNIQUE,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100)
);

-- Table: Orders
CREATE TABLE Orders (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ClientId INT NOT NULL,
    OrderEventId INT NOT NULL,
    Description TEXT,
    OrderStatusId INT NOT NULL,
    Deadline DATETIME NOT NULL,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100),
    FOREIGN KEY (ClientId) REFERENCES Client(Id) ON DELETE CASCADE,
    FOREIGN KEY (OrderEventId) REFERENCES ClientEvent(Id) ON DELETE RESTRICT,
    FOREIGN KEY (OrderStatusId) REFERENCES OrderStatus(Id) ON DELETE RESTRICT
);

-- Table: ProductSizeMeasurements
CREATE TABLE ProductSizeMeasurements (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    SizeOptionsId INT NOT NULL,
    ProductCategoryId INT NOT NULL,
    ProductCutOptionId INT NOT NULL,
    SizeMeasurementsId INT NOT NULL,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100),
    FOREIGN KEY (SizeOptionsId) REFERENCES SizeOptions(Id) ON DELETE RESTRICT,
    FOREIGN KEY (ProductCategoryId) REFERENCES ProductCategory(Id) ON DELETE RESTRICT,
    FOREIGN KEY (ProductCutOptionId) REFERENCES ProductCutOptions(Id) ON DELETE RESTRICT
);

-- Table: SizeMeasurements
CREATE TABLE SizeMeasurements (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ProductSizeMeasurementsId INT NOT NULL,
    Measurement1 VARCHAR(255),
    FrontLengthHPS DECIMAL(5,2) DEFAULT NULL,
    BackLengthHPS DECIMAL(5,2) DEFAULT NULL,
    AcrossShoulders DECIMAL(5,2) DEFAULT NULL,
    ArmHole DECIMAL(5,2) DEFAULT NULL,
    UpperChest DECIMAL(5,2) DEFAULT NULL,
    LowerChest DECIMAL(5,2) DEFAULT NULL,
    Waist DECIMAL(5,2) DEFAULT NULL,
    BottomWidth DECIMAL(5,2) DEFAULT NULL,
    SleeveLength DECIMAL(5,2) DEFAULT NULL,
    SleeveOpening DECIMAL(5,2) DEFAULT NULL,
    NeckSize DECIMAL(5,2) DEFAULT NULL,
    CollarHeight DECIMAL(5,2) DEFAULT NULL,
    CollarPointHeight DECIMAL(5,2) DEFAULT NULL,
    StandHeightBack DECIMAL(5,2) DEFAULT NULL,
    CollarStandLength DECIMAL(5,2) DEFAULT NULL,
    SideVentFront DECIMAL(5,2) DEFAULT NULL,
    SideVentBack DECIMAL(5,2) DEFAULT NULL,
    PlacketLength DECIMAL(5,2) DEFAULT NULL,
    TwoButtonDistance DECIMAL(5,2) DEFAULT NULL,
    PlacketWidth DECIMAL(5,2) DEFAULT NULL,
    BottomHem DECIMAL(5,2) DEFAULT NULL,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100),
    FOREIGN KEY (ProductSizeMeasurementsId) REFERENCES ProductSizeMeasurements(Id) ON DELETE CASCADE
);

-- Table: Product
CREATE TABLE Product (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ProductCategoryId INT NOT NULL,
    FabricTypeId INT NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Description TEXT,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100),
    FOREIGN KEY (ProductCategoryId) REFERENCES ProductCategory(Id) ON DELETE RESTRICT,
    FOREIGN KEY (FabricTypeId) REFERENCES FabricType(Id) ON DELETE RESTRICT
);

-- Table: ProductDetails
CREATE TABLE ProductDetails (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ProductId INT NOT NULL,
    ProductCutOptionId INT NOT NULL,
    ProductSizeMeasurementId INT NOT NULL,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100),
    FOREIGN KEY (ProductId) REFERENCES Product(Id) ON DELETE CASCADE,
    FOREIGN KEY (ProductCutOptionId) REFERENCES ProductCutOptions(Id) ON DELETE RESTRICT,
    FOREIGN KEY (ProductSizeMeasurementId) REFERENCES ProductSizeMeasurements(Id) ON DELETE RESTRICT
);

-- Table: AvailableColorOptions
CREATE TABLE AvailableColorOptions (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ColorName VARCHAR(255) NOT NULL,
    ProductId INT NOT NULL,
    ImageId INT,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100),
    FOREIGN KEY (ProductId) REFERENCES Product(Id) ON DELETE CASCADE
);

-- Table: OrderServicesOption (Master Table)
CREATE TABLE OrderServicesOption (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    ServiceName VARCHAR(255) NOT NULL UNIQUE,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100)
);

-- Table: OrderServiceUnits
CREATE TABLE OrderServiceUnits (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    UnitMeasureName VARCHAR(255) NOT NULL,
    Name VARCHAR(255) NOT NULL,
    OrderServiceOptionId INT NOT NULL,
    CostPerUnit DECIMAL(10,2) NOT NULL,
    Currency VARCHAR(10) NOT NULL,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100),
    FOREIGN KEY (OrderServiceOptionId) REFERENCES OrderServicesOption(Id) ON DELETE RESTRICT
);

-- Table: OrderItems
CREATE TABLE OrderItems (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    OrderId INT NOT NULL,
    ProductId INT NOT NULL,
    Description TEXT,
    ImageId INT,
    FileId INT,
    VideoId INT,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100),
    FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE,
    FOREIGN KEY (ProductId) REFERENCES Product(Id) ON DELETE RESTRICT
);

-- Table: OrderItemsPrintingOptions
CREATE TABLE OrderItemsPrintingOptions (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    OrderItemId INT NOT NULL,
    PrintingOptionId INT NOT NULL,
    Description TEXT,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100),
    FOREIGN KEY (OrderItemId) REFERENCES OrderItems(Id) ON DELETE CASCADE,
    FOREIGN KEY (PrintingOptionId) REFERENCES PrintingOptions(Id) ON DELETE RESTRICT
);

-- Table: OrderServices
CREATE TABLE OrderServices (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    OrderServiceOptionId INT NOT NULL,
    QuantityDetail TEXT,
    Description TEXT,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100),
    FOREIGN KEY (OrderServiceOptionId) REFERENCES OrderServicesOption(Id) ON DELETE RESTRICT
);

-- Table: OrderServicesMedia
CREATE TABLE OrderServicesMedia (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    OrderServicesId INT NOT NULL,
    PhotoId INT,
    FileId INT,
    VideoId INT,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100),
    FOREIGN KEY (OrderServicesId) REFERENCES OrderServices(Id) ON DELETE CASCADE
);

-- Insert statements for master tables
INSERT INTO ClientStatus (StatusName, Description) VALUES
('Active', 'Currently active clients'),
('Inactive', 'Inactive or dormant clients');

INSERT INTO OrderStatus (StatusName, Description) VALUES
('Pending', 'Order is pending'),
('Completed', 'Order has been completed'),
('Cancelled', 'Order was cancelled');

INSERT INTO OrderType (TypeName, Description) VALUES
('Services', 'Service-related orders'),
('Products', 'Product-related orders');

INSERT INTO OrderCategory (CategoryName, Description) VALUES
('Samples', 'Sample-related orders'),
('Giveaways', 'Orders for giveaways'),
('Events', 'Orders related to events');

INSERT INTO ProductCategory (Type) VALUES
('Tshirt'),
('Short'),
('Tracksuit'),
('Sweatshirt'),
('Hoodie'),
('Jackets'),
('Socks'),
('Poloshirt'),
('Scrub'),
('Longcoat');

INSERT INTO FabricType (Type, Name, GSM) VALUES
('Knitwear', 'Interlock', 160);

INSERT INTO PrintingOptions (Type) VALUES
('Sublimation'),
('DTF'),
('Vinyl'),
('Siliconprinting'),
('DTG');

INSERT INTO SizeOptions (OptionSizeOptions) VALUES
('4'),
('6'),
('8'),
('12'),
('14'),
('Small'),
('Medium'),
('Large'),
('XL'),
('XXL'),
('XXXL'),
('XXXXL');

INSERT INTO ProductCutOptions (OptionProductCutOptions) VALUES
('Male'),
('Female'),
('Unisex'),
('Regenal'),
('UK');

INSERT INTO OrderServicesOption (ServiceName) VALUES
('Sublimation'),
('DTF'),
('Embroidery'),
('Graphics'),
('Vinyl'),
('Caps'),
('Bags'),
('Stitching'),
('Heat bed'),
('Photostudio Rent'),
('Photoshoot'),
('AI Shoot');


-- Table: OrderDoc
CREATE TABLE OrderDoc (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    DocumentId INT NOT NULL,
    DocumentTypeId INT NOT NULL,
    OrderId INT NOT NULL,
    OrderItemId INT DEFAULT NULL,
    Description TEXT,
    CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
    CreatedBy VARCHAR(100),
    UpdatedOn DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UpdatedBy VARCHAR(100),
    FOREIGN KEY (DocumentId) REFERENCES Document(Id) ON DELETE CASCADE,
    FOREIGN KEY (DocumentTypeId) REFERENCES DocType(Id) ON DELETE RESTRICT,
    FOREIGN KEY (OrderId) REFERENCES Orders(Id) ON DELETE CASCADE,
    FOREIGN KEY (OrderItemId) REFERENCES OrderItems(Id) ON DELETE CASCADE
);
