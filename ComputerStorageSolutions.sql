--CREATE DATABASE ComputerStorageSolutions

-- Create Roles Table
CREATE TABLE Roles (
    RoleId UniqueIdentifier PRIMARY KEY default newid(),
    RoleName NVARCHAR(50) NOT NULL
);
 
-- Create Users Table
CREATE TABLE Users (
    UserId UniqueIdentifier PRIMARY KEY default newid(),
    Username NVARCHAR(100) NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    RoleId UniqueIdentifier FOREIGN KEY REFERENCES Roles(RoleId),
    CreatedDate DATETIME NOT NULL,
    IsActive BIT NOT NULL
);
 
-- Create Categories Table
CREATE TABLE Categories (
    CategoryId INT PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255)
);
 
-- Create Products Table
CREATE TABLE Products (
    ProductId UniqueIdentifier PRIMARY KEY default newsequentialid(),
    ProductName NVARCHAR(100) NOT NULL,
    CategoryId INT FOREIGN KEY REFERENCES Categories(CategoryId),
    Description NVARCHAR(255),
    Price DECIMAL(10, 2) NOT NULL,
    StockQuantity INT NOT NULL,
    ImageUrl NVARCHAR(255),
	[Status] NVARCHAR(30) NOT NULL
);
 
-- Create Orders Table
CREATE TABLE Orders (
    OrderId UniqueIdentifier PRIMARY KEY default newid(),
    UserId UniqueIdentifier FOREIGN KEY REFERENCES Users(UserId),
    OrderDate DATETIME NOT NULL,
    TotalAmount DECIMAL(10, 2) NOT NULL,
    OrderStatus NVARCHAR(50),
    ShippingAddress NVARCHAR(255)
);
 
-- Create OrderDetails Table
CREATE TABLE OrderDetails (
    OrderDetailId UniqueIdentifier PRIMARY KEY default newsequentialid(),
    OrderId UniqueIdentifier FOREIGN KEY REFERENCES Orders(OrderId),
    ProductId uniqueidentifier FOREIGN KEY REFERENCES Products(ProductId),
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10, 2) NOT NULL
);
 
-- Create Invoices Table (Optional)
CREATE TABLE Invoices (
    InvoiceId UniqueIdentifier PRIMARY KEY default newid() ,
    OrderId UniqueIdentifier FOREIGN KEY REFERENCES Orders(OrderId),
    InvoiceDate DATETIME NOT NULL,
    BillingAddress NVARCHAR(255),
    TotalAmount DECIMAL(10, 2) NOT NULL
);

CREATE TABLE CART(
	CartId UniqueIdentifier PRIMARY KEY default newid(),
	UserId UniqueIdentifier FOREIGN KEY REFERENCES Users(UserId),
	ProductId UniqueIdentifier FOREIGN KEY REFERENCES Products(ProductId),
	Quantity INT NOT NULL,
);


-- Insert data into Roles
INSERT INTO Roles (RoleName) VALUES ('Admin');
INSERT INTO Roles (RoleName) VALUES ('Customer');

 
-- Insert data into Users
INSERT INTO Users (Username, PasswordHash, Email, RoleId, CreatedDate, IsActive)
VALUES
('admin', 'password', 'admin1@gmail.com', (SELECT RoleId FROM Roles WHERE RoleName = 'Admin'), '2024-08-11 10:00:00', 1),
('johndoe', 'hashed_pw2', 'johndoe@gmail.com', (SELECT RoleId FROM Roles WHERE RoleName = 'Customer'), '2024-08-11 10:10:00', 1),
('janedoe', 'hashed_pw3', 'janedoe@gmail.com', (SELECT RoleId FROM Roles WHERE RoleName = 'Customer'), '2024-08-11 10:20:00', 1);

-- Insert data into Categories
INSERT INTO Categories (CategoryId, CategoryName, Description)
VALUES
(1, 'SSD', 'Solid State Drives'),
(2, 'HDD', 'Hard Disk Drives'),
(3, 'Flash Drives', 'USB Flash Drives'),
(4, 'Memory Cards', 'SD Cards and MicroSD Cards');
 
-- Insert data into Products
INSERT INTO Products (ProductName, CategoryId, Description, Price, StockQuantity, ImageUrl, [Status])
VALUES
('1TB SSD', 1, 'High-speed SSD with 1TB capacity', 120.00, 50, '/images/1tb_ssd.png', 'Available'),
('500GB SSD', 1, 'Mid-range SSD with 500GB capacity', 70.00, 75, '/images/500gb_ssd.png', 'Available'),
('2TB HDD', 2, 'Reliable HDD with 2TB capacity', 80.00, 30, '/images/2tb_hdd.png', 'Available'),
('1TB HDD', 2, 'Affordable HDD with 1TB capacity', 50.00, 100, '/images/1tb_hdd.png', 'Available'),
('64GB Flash Drive', 3, 'Compact 64GB USB Flash Drive', 15.00, 200, '/images/64gb_flash.png', 'Available'),
('128GB Flash Drive', 3, 'High-capacity 128GB USB Flash Drive', 25.00, 150, '/images/128gb_flash.png', 'Available'),
('32GB Memory Card', 4, '32GB MicroSD Memory Card', 10.00, 300, '/images/32gb_sd.png', 'Available'),
('64GB Memory Card', 4, '64GB MicroSD Memory Card', 20.00, 250, '/images/64gb_sd.png', 'Available');


INSERT INTO Orders (OrderId, UserId, OrderDate, TotalAmount, OrderStatus, ShippingAddress)
VALUES 
(NEWID(), 'A2887F44-4F46-4196-8B61-BAD0E46DF7D9', '2024-08-01', 150.00, 'Shipped', '123 Main St, City, Country'),
(NEWID(), '45CF8051-E083-4873-B273-FA4A467687AD', '2024-08-02', 200.00, 'Processing', '456 Elm St, City, Country'),
(NEWID(), 'A2887F44-4F46-4196-8B61-BAD0E46DF7D9', '2024-08-03', 250.00, 'Delivered', '789 Oak St, City, Country'),
(NEWID(), '45CF8051-E083-4873-B273-FA4A467687AD', '2024-08-04', 300.00, 'Cancelled', '101 Pine St, City, Country'),
(NEWID(), 'A2887F44-4F46-4196-8B61-BAD0E46DF7D9', '2024-08-05', 350.00, 'Pending', '202 Maple St, City, Country');


INSERT INTO OrderDetails (OrderDetailId, OrderId, ProductId, Quantity, UnitPrice)
VALUES 
(NEWID(), '8F3E99AB-AEF0-44CD-A5E7-01D449F3D5A7', '3FA85F64-5717-4562-B3FC-2C963F66AFA6', 2, 75.00),
(NEWID(), '6843CE9E-8506-4296-9083-2E739AB956D0', '665BBC35-DE5E-EF11-8496-BC035861A58E', 1, 200.00),
(NEWID(), 'DC976F92-66CC-4CD3-801B-6B267CB8E16C', '675BBC35-DE5E-EF11-8496-BC035861A58E', 5, 50.00),
(NEWID(), '9075B42A-9923-4E5E-8E06-B1D4417E5E32', '685BBC35-DE5E-EF11-8496-BC035861A58E', 3, 100.00),
(NEWID(), 'DBD91776-72C7-4704-9641-CF69FCFD9C4A', '695BBC35-DE5E-EF11-8496-BC035861A58E', 7, 50.00)

-- Display data from all tables
 
-- Display Roles
SELECT * FROM Roles;
 
-- Display Users
SELECT * FROM Users;
 
-- Display Categories
SELECT * FROM Categories;
 
-- Display Products
SELECT * FROM Products;
 
