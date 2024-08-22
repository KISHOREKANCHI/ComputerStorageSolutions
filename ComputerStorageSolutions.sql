--CREATE DATABASE ComputerStorageSolutions

-- Create Roles Table
CREATE TABLE Roles (
    RoleId INT PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL
);
 
-- Create Users Table
CREATE TABLE Users (
    UserId INT PRIMARY KEY,
    Username NVARCHAR(100) NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    RoleId INT FOREIGN KEY REFERENCES Roles(RoleId),
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
    ProductId INT PRIMARY KEY,
    ProductName NVARCHAR(100) NOT NULL,
    CategoryId INT FOREIGN KEY REFERENCES Categories(CategoryId),
    Description NVARCHAR(255),
    Price DECIMAL(10, 2) NOT NULL,
    StockQuantity INT NOT NULL,
    ImageUrl NVARCHAR(255)
);
 
-- Create Orders Table
CREATE TABLE Orders (
    OrderId INT PRIMARY KEY,
    UserId INT FOREIGN KEY REFERENCES Users(UserId),
    OrderDate DATETIME NOT NULL,
    TotalAmount DECIMAL(10, 2) NOT NULL,
    OrderStatus NVARCHAR(50),
    ShippingAddress NVARCHAR(255)
);
 
-- Create OrderDetails Table
CREATE TABLE OrderDetails (
    OrderDetailId INT PRIMARY KEY,
    OrderId INT FOREIGN KEY REFERENCES Orders(OrderId),
    ProductId INT FOREIGN KEY REFERENCES Products(ProductId),
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(10, 2) NOT NULL
);
 
-- Create Invoices Table (Optional)
CREATE TABLE Invoices (
    InvoiceId INT PRIMARY KEY,
    OrderId INT FOREIGN KEY REFERENCES Orders(OrderId),
    InvoiceDate DATETIME NOT NULL,
    BillingAddress NVARCHAR(255),
    TotalAmount DECIMAL(10, 2) NOT NULL
);
 
-- Insert data into Roles
INSERT INTO Roles (RoleId, RoleName) VALUES (1, 'Admin');
INSERT INTO Roles (RoleId, RoleName) VALUES (2, 'Customer');
 
-- Insert data into Users
INSERT INTO Users (UserId, Username, PasswordHash, Email, RoleId, CreatedDate, IsActive)
VALUES
(1, 'admin1', '[hashed_pw1]', 'admin1@example.com', 1, '2024-08-11 10:00:00', 1),
(2, 'johndoe', '[hashed_pw2]', 'johndoe@example.com', 2, '2024-08-11 10:10:00', 1),
(3, 'janedoe', '[hashed_pw3]', 'janedoe@example.com', 2, '2024-08-11 10:20:00', 1),
(4, 'user1', '[hashed_pw4]', 'user1@example.com', 2, '2024-08-11 10:30:00', 1),
(5, 'user2', '[hashed_pw5]', 'user2@example.com', 2, '2024-08-11 10:40:00', 1),
(6, 'user3', '[hashed_pw6]', 'user3@example.com', 2, '2024-08-11 10:50:00', 1),
(7, 'user4', '[hashed_pw7]', 'user4@example.com', 2, '2024-08-11 11:00:00', 1),
(8, 'user5', '[hashed_pw8]', 'user5@example.com', 2, '2024-08-11 11:10:00', 1),
(9, 'user6', '[hashed_pw9]', 'user6@example.com', 2, '2024-08-11 11:20:00', 1),
(10, 'user7', '[hashed_pw10]', 'user7@example.com', 2, '2024-08-11 11:30:00', 1);
 
-- Insert data into Categories
INSERT INTO Categories (CategoryId, CategoryName, Description)
VALUES
(1, 'SSD', 'Solid State Drives'),
(2, 'HDD', 'Hard Disk Drives'),
(3, 'Flash Drives', 'USB Flash Drives'),
(4, 'Memory Cards', 'SD Cards and MicroSD Cards');
 
-- Insert data into Products
INSERT INTO Products (ProductId, ProductName, CategoryId, Description, Price, StockQuantity, ImageUrl)
VALUES
(1, '1TB SSD', 1, 'High-speed SSD with 1TB capacity', 120.00, 50, '/images/1tb_ssd.png'),
(2, '500GB SSD', 1, 'Mid-range SSD with 500GB capacity', 70.00, 75, '/images/500gb_ssd.png'),
(3, '2TB HDD', 2, 'Reliable HDD with 2TB capacity', 80.00, 30, '/images/2tb_hdd.png'),
(4, '1TB HDD', 2, 'Affordable HDD with 1TB capacity', 50.00, 100, '/images/1tb_hdd.png'),
(5, '64GB Flash Drive', 3, 'Compact 64GB USB Flash Drive', 15.00, 200, '/images/64gb_flash.png'),
(6, '128GB Flash Drive', 3, 'High-capacity 128GB USB Flash Drive', 25.00, 150, '/images/128gb_flash.png'),
(7, '32GB Memory Card', 4, '32GB MicroSD Memory Card', 10.00, 300, '/images/32gb_sd.png'),
(8, '64GB Memory Card', 4, '64GB MicroSD Memory Card', 20.00, 250, '/images/64gb_sd.png');
 
-- Insert data into Orders
INSERT INTO Orders (OrderId, UserId, OrderDate, TotalAmount, OrderStatus, ShippingAddress)
VALUES
(1, 2, '2024-08-11 12:00:00', 120.00, 'Pending', '123 Main St, Springfield'),
(2, 3, '2024-08-11 12:10:00', 95.00, 'Shipped', '456 Elm St, Springfield'),
(3, 4, '2024-08-11 12:20:00', 140.00, 'Delivered', '789 Oak St, Springfield'),
(4, 5, '2024-08-11 12:30:00', 50.00, 'Pending', '101 Pine St, Springfield');
 
-- Insert data into OrderDetails
INSERT INTO OrderDetails (OrderDetailId, OrderId, ProductId, Quantity, UnitPrice)
VALUES
(1, 1, 1, 1, 120.00),
(2, 2, 2, 1, 70.00),
(3, 2, 5, 1, 25.00),
(4, 3, 3, 1, 80.00),
(5, 3, 6, 1, 60.00),
(6, 4, 4, 1, 50.00);

-- Display data from all tables
 
-- Display Roles
SELECT * FROM Roles;
 
-- Display Users
SELECT * FROM Users;
 
-- Display Categories
SELECT * FROM Categories;
 
-- Display Products
SELECT * FROM Products;
 
-- Display Orders
SELECT * FROM Orders;
 
-- Display OrderDetails
SELECT * FROM OrderDetails;
