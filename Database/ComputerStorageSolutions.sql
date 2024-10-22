USE [master]
GO
/****** Object:  Database [ComputerStorageSolutions]    Script Date: 9/9/2024 11:46:43 AM ******/
CREATE DATABASE [ComputerStorageSolutions]
GO
ALTER DATABASE [ComputerStorageSolutions] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [ComputerStorageSolutions].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [ComputerStorageSolutions] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [ComputerStorageSolutions] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [ComputerStorageSolutions] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [ComputerStorageSolutions] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [ComputerStorageSolutions] SET ARITHABORT OFF 
GO
ALTER DATABASE [ComputerStorageSolutions] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [ComputerStorageSolutions] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [ComputerStorageSolutions] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [ComputerStorageSolutions] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [ComputerStorageSolutions] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [ComputerStorageSolutions] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [ComputerStorageSolutions] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [ComputerStorageSolutions] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [ComputerStorageSolutions] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [ComputerStorageSolutions] SET  DISABLE_BROKER 
GO
ALTER DATABASE [ComputerStorageSolutions] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [ComputerStorageSolutions] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [ComputerStorageSolutions] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [ComputerStorageSolutions] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [ComputerStorageSolutions] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [ComputerStorageSolutions] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [ComputerStorageSolutions] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [ComputerStorageSolutions] SET RECOVERY FULL 
GO
ALTER DATABASE [ComputerStorageSolutions] SET  MULTI_USER 
GO
ALTER DATABASE [ComputerStorageSolutions] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [ComputerStorageSolutions] SET DB_CHAINING OFF 
GO
ALTER DATABASE [ComputerStorageSolutions] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [ComputerStorageSolutions] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [ComputerStorageSolutions] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [ComputerStorageSolutions] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'ComputerStorageSolutions', N'ON'
GO
ALTER DATABASE [ComputerStorageSolutions] SET QUERY_STORE = OFF
GO
USE [ComputerStorageSolutions]
GO
/****** Object:  Table [dbo].[CART]    Script Date: 9/9/2024 11:46:44 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CART](
	[CartId] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NULL,
	[ProductId] [uniqueidentifier] NULL,
	[Quantity] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[CartId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Categories]    Script Date: 9/9/2024 11:46:44 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Categories](
	[CategoryId] [int] NOT NULL,
	[CategoryName] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[CategoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Invoices]    Script Date: 9/9/2024 11:46:44 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Invoices](
	[InvoiceId] [uniqueidentifier] NOT NULL,
	[OrderId] [uniqueidentifier] NULL,
	[InvoiceDate] [datetime] NOT NULL,
	[BillingAddress] [nvarchar](255) NULL,
	[TotalAmount] [decimal](10, 2) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[InvoiceId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OrderDetails]    Script Date: 9/9/2024 11:46:44 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrderDetails](
	[OrderDetailId] [uniqueidentifier] NOT NULL,
	[OrderId] [uniqueidentifier] NULL,
	[ProductId] [uniqueidentifier] NULL,
	[Quantity] [int] NOT NULL,
	[UnitPrice] [decimal](10, 2) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[OrderDetailId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Orders]    Script Date: 9/9/2024 11:46:44 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Orders](
	[OrderId] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NULL,
	[OrderDate] [datetime] NOT NULL,
	[TotalAmount] [decimal](10, 2) NOT NULL,
	[OrderStatus] [nvarchar](50) NULL,
	[ShippingAddress] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[OrderId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Products]    Script Date: 9/9/2024 11:46:44 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Products](
	[ProductId] [uniqueidentifier] NOT NULL,
	[ProductName] [nvarchar](100) NOT NULL,
	[CategoryId] [int] NULL,
	[Description] [nvarchar](255) NULL,
	[Price] [decimal](10, 2) NOT NULL,
	[StockQuantity] [int] NOT NULL,
	[ImageUrl] [nvarchar](255) NULL,
	[Status] [nvarchar](30) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ProductId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Roles]    Script Date: 9/9/2024 11:46:44 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Roles](
	[RoleId] [uniqueidentifier] NOT NULL,
	[RoleName] [nvarchar](50) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 9/9/2024 11:46:44 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UserId] [uniqueidentifier] NOT NULL,
	[Username] [nvarchar](100) NOT NULL,
	[PasswordHash] [nvarchar](255) NOT NULL,
	[Email] [nvarchar](255) NOT NULL,
	[RoleId] [uniqueidentifier] NULL,
	[CreatedDate] [datetime] NOT NULL,
	[IsActive] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[Categories] ([CategoryId], [CategoryName], [Description]) VALUES (1, N'SSD', N'Solid State Drives')
INSERT [dbo].[Categories] ([CategoryId], [CategoryName], [Description]) VALUES (2, N'HDD', N'Hard Disk Drives')
INSERT [dbo].[Categories] ([CategoryId], [CategoryName], [Description]) VALUES (3, N'Flash Drives', N'USB Flash Drives')
INSERT [dbo].[Categories] ([CategoryId], [CategoryName], [Description]) VALUES (4, N'Memory Cards', N'SD Cards and MicroSD Cards')
GO
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'e71043b3-e959-4e74-d6b7-08dccb3cca25', N'86a3e333-d9e6-404c-98f2-08dccb3cc9dc', N'87a9681b-0669-ef11-93bf-005056bdf33b', 3, CAST(120.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'abbdda88-4192-46db-d6b8-08dccb3cca25', N'86a3e333-d9e6-404c-98f2-08dccb3cc9dc', N'88a9681b-0669-ef11-93bf-005056bdf33b', 3, CAST(200.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'31fd1024-cd5a-4985-d6b9-08dccb3cca25', N'cbdb1289-a88a-4ad8-98f3-08dccb3cc9dc', N'8ba9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(15.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'586eb8e0-b78b-40b2-d6ba-08dccb3cca25', N'69077bc6-a03c-4c29-98f4-08dccb3cc9dc', N'8ba9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(15.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'07f04938-9540-4998-d6bb-08dccb3cca25', N'bca32d40-1b58-471a-98f5-08dccb3cc9dc', N'88a9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(200.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'dba09b89-dcb3-4937-ff35-08dccd781d2d', N'4b82a82e-654f-4d85-2088-08dccd781d0b', N'87a9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(120.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'82cba201-6c7f-4578-01b2-08dcd025fe82', N'4a973d7c-2ab1-4b0e-8a4d-08dcd025fe58', N'87a9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(120.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'f7623fa6-ec77-4f06-01b3-08dcd025fe82', N'4f21caa3-3f4f-4fd3-8a4e-08dcd025fe58', N'87a9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(120.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'7d410c24-c88e-467a-01b4-08dcd025fe82', N'4f21caa3-3f4f-4fd3-8a4e-08dcd025fe58', N'88a9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(200.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'e527670f-1a2b-4f1c-01b5-08dcd025fe82', N'4f21caa3-3f4f-4fd3-8a4e-08dcd025fe58', N'89a9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(80.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'a6fa8d4a-65da-4104-01b6-08dcd025fe82', N'8fea1a73-9d18-4157-8a4f-08dcd025fe58', N'87a9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(120.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'205c2f9f-1ef5-4cc8-01b7-08dcd025fe82', N'8fea1a73-9d18-4157-8a4f-08dcd025fe58', N'88a9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(200.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'41120c4f-42c4-426c-01b8-08dcd025fe82', N'a321c6d6-d335-40d7-8a50-08dcd025fe58', N'87a9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(120.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'61b6f42d-c1c8-4289-01b9-08dcd025fe82', N'a321c6d6-d335-40d7-8a50-08dcd025fe58', N'88a9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(200.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'88841f61-8e1a-4750-01ba-08dcd025fe82', N'a321c6d6-d335-40d7-8a50-08dcd025fe58', N'8ea9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(20.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'be7c68ca-b2f3-4d6b-01bb-08dcd025fe82', N'a321c6d6-d335-40d7-8a50-08dcd025fe58', N'8da9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(10.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'b589a3cb-8ed8-4181-01bc-08dcd025fe82', N'5890cbf8-f6d4-4d3d-8a51-08dcd025fe58', N'87a9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(120.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'243a5d5c-30a6-44e0-01bd-08dcd025fe82', N'5890cbf8-f6d4-4d3d-8a51-08dcd025fe58', N'8da9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(10.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'fd46c4ee-6c10-4814-01be-08dcd025fe82', N'80b5f497-8e6e-4417-8a52-08dcd025fe58', N'89a9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(80.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'588f715d-acd2-4918-01bf-08dcd025fe82', N'05752fbb-5616-41d4-8a53-08dcd025fe58', N'8ea9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(20.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'b61063bc-e7a4-48c5-01c0-08dcd025fe82', N'05752fbb-5616-41d4-8a53-08dcd025fe58', N'8da9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(10.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'ae46fd3d-8431-4581-01c1-08dcd025fe82', N'05752fbb-5616-41d4-8a53-08dcd025fe58', N'8ba9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(15.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'14f140b5-c75d-48ca-01c2-08dcd025fe82', N'05752fbb-5616-41d4-8a53-08dcd025fe58', N'89a9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(80.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'a04fab85-d411-46a6-01c3-08dcd025fe82', N'1f08dacf-dc8c-45c2-8a54-08dcd025fe58', N'87a9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(120.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'6529e8d6-2f3f-4327-01c4-08dcd025fe82', N'1f08dacf-dc8c-45c2-8a54-08dcd025fe58', N'8ba9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(15.00 AS Decimal(10, 2)))
INSERT [dbo].[OrderDetails] ([OrderDetailId], [OrderId], [ProductId], [Quantity], [UnitPrice]) VALUES (N'a440d6b2-43da-4001-01c5-08dcd025fe82', N'1f08dacf-dc8c-45c2-8a54-08dcd025fe58', N'89a9681b-0669-ef11-93bf-005056bdf33b', 1, CAST(80.00 AS Decimal(10, 2)))
GO
INSERT [dbo].[Orders] ([OrderId], [UserId], [OrderDate], [TotalAmount], [OrderStatus], [ShippingAddress]) VALUES (N'86a3e333-d9e6-404c-98f2-08dccb3cc9dc', N'6f6a7bf5-b2d8-47b1-f21d-08dccb2afd66', CAST(N'2024-09-02T16:18:32.443' AS DateTime), CAST(960.00 AS Decimal(10, 2)), N'Order Placed', N'tfut, adg, VADV, AVad')
INSERT [dbo].[Orders] ([OrderId], [UserId], [OrderDate], [TotalAmount], [OrderStatus], [ShippingAddress]) VALUES (N'cbdb1289-a88a-4ad8-98f3-08dccb3cc9dc', N'6f6a7bf5-b2d8-47b1-f21d-08dccb2afd66', CAST(N'2024-09-02T16:21:58.170' AS DateTime), CAST(15.00 AS Decimal(10, 2)), N'Order Placed', N'wrgar, brw, WBRB, Wgrw')
INSERT [dbo].[Orders] ([OrderId], [UserId], [OrderDate], [TotalAmount], [OrderStatus], [ShippingAddress]) VALUES (N'69077bc6-a03c-4c29-98f4-08dccb3cc9dc', N'6f6a7bf5-b2d8-47b1-f21d-08dccb2afd66', CAST(N'2024-09-02T16:22:54.997' AS DateTime), CAST(15.00 AS Decimal(10, 2)), N'Order Placed', N'wgrwgg2vwr, gvgwv, EV, wgw')
INSERT [dbo].[Orders] ([OrderId], [UserId], [OrderDate], [TotalAmount], [OrderStatus], [ShippingAddress]) VALUES (N'bca32d40-1b58-471a-98f5-08dccb3cc9dc', N'6f6a7bf5-b2d8-47b1-f21d-08dccb2afd66', CAST(N'2024-09-02T16:25:45.387' AS DateTime), CAST(200.00 AS Decimal(10, 2)), N'Order Placed', N'EGWG, qegew, EGVEW, eqveg')
INSERT [dbo].[Orders] ([OrderId], [UserId], [OrderDate], [TotalAmount], [OrderStatus], [ShippingAddress]) VALUES (N'4b82a82e-654f-4d85-2088-08dccd781d0b', N'01553459-e8e7-4918-fcc5-08dccd76f5d4', CAST(N'2024-09-05T12:28:14.647' AS DateTime), CAST(120.00 AS Decimal(10, 2)), N'Order Placed', N'wdcc, 232dc, hyd, 20343')
INSERT [dbo].[Orders] ([OrderId], [UserId], [OrderDate], [TotalAmount], [OrderStatus], [ShippingAddress]) VALUES (N'4a973d7c-2ab1-4b0e-8a4d-08dcd025fe58', N'6f6a7bf5-b2d8-47b1-f21d-08dccb2afd66', CAST(N'2024-09-08T22:17:57.900' AS DateTime), CAST(120.00 AS Decimal(10, 2)), N'Order Placed', N'mouni, ads, hyd, 500323')
INSERT [dbo].[Orders] ([OrderId], [UserId], [OrderDate], [TotalAmount], [OrderStatus], [ShippingAddress]) VALUES (N'4f21caa3-3f4f-4fd3-8a4e-08dcd025fe58', N'6f6a7bf5-b2d8-47b1-f21d-08dccb2afd66', CAST(N'2024-08-08T22:21:01.620' AS DateTime), CAST(400.00 AS Decimal(10, 2)), N'Order Placed', N'Raju, 1/12, Hyd, 500032')
INSERT [dbo].[Orders] ([OrderId], [UserId], [OrderDate], [TotalAmount], [OrderStatus], [ShippingAddress]) VALUES (N'8fea1a73-9d18-4157-8a4f-08dcd025fe58', N'6f6a7bf5-b2d8-47b1-f21d-08dccb2afd66', CAST(N'2024-08-04T22:23:35.980' AS DateTime), CAST(320.00 AS Decimal(10, 2)), N'Order Placed', N'Krishna, 5-123, HYD, 500433')
INSERT [dbo].[Orders] ([OrderId], [UserId], [OrderDate], [TotalAmount], [OrderStatus], [ShippingAddress]) VALUES (N'a321c6d6-d335-40d7-8a50-08dcd025fe58', N'6f6a7bf5-b2d8-47b1-f21d-08dccb2afd66', CAST(N'2024-07-28T22:26:36.190' AS DateTime), CAST(350.00 AS Decimal(10, 2)), N'Order Placed', N'yash, 5/56, Hyd, 500433')
INSERT [dbo].[Orders] ([OrderId], [UserId], [OrderDate], [TotalAmount], [OrderStatus], [ShippingAddress]) VALUES (N'5890cbf8-f6d4-4d3d-8a51-08dcd025fe58', N'6f6a7bf5-b2d8-47b1-f21d-08dccb2afd66', CAST(N'2024-07-08T22:34:59.267' AS DateTime), CAST(130.00 AS Decimal(10, 2)), N'Order Placed', N'sravs, 2/212, Hyd, 500032')
INSERT [dbo].[Orders] ([OrderId], [UserId], [OrderDate], [TotalAmount], [OrderStatus], [ShippingAddress]) VALUES (N'80b5f497-8e6e-4417-8a52-08dcd025fe58', N'6f6a7bf5-b2d8-47b1-f21d-08dccb2afd66', CAST(N'2024-06-08T22:37:17.047' AS DateTime), CAST(80.00 AS Decimal(10, 2)), N'Order Placed', N'Tanish, 5/57, HYD, 500652')
INSERT [dbo].[Orders] ([OrderId], [UserId], [OrderDate], [TotalAmount], [OrderStatus], [ShippingAddress]) VALUES (N'05752fbb-5616-41d4-8a53-08dcd025fe58', N'6f6a7bf5-b2d8-47b1-f21d-08dccb2afd66', CAST(N'2024-05-30T22:39:44.867' AS DateTime), CAST(125.00 AS Decimal(10, 2)), N'Order Placed', N'Arun, 3/21, Delhi, 123432')
INSERT [dbo].[Orders] ([OrderId], [UserId], [OrderDate], [TotalAmount], [OrderStatus], [ShippingAddress]) VALUES (N'1f08dacf-dc8c-45c2-8a54-08dcd025fe58', N'6f6a7bf5-b2d8-47b1-f21d-08dccb2afd66', CAST(N'2024-04-18T22:45:07.233' AS DateTime), CAST(215.00 AS Decimal(10, 2)), N'Order Placed', N'Sanan, 5/233, HYD, 500433')
GO
INSERT [dbo].[Products] ([ProductId], [ProductName], [CategoryId], [Description], [Price], [StockQuantity], [ImageUrl], [Status]) VALUES (N'87a9681b-0669-ef11-93bf-005056bdf33b', N'1TB SSD', 1, N'High-speed SSD with 1TB capacity', CAST(120.00 AS Decimal(10, 2)), 40, N'\Images\1TB SSD.jpg', N'Available')
INSERT [dbo].[Products] ([ProductId], [ProductName], [CategoryId], [Description], [Price], [StockQuantity], [ImageUrl], [Status]) VALUES (N'88a9681b-0669-ef11-93bf-005056bdf33b', N'2TB SSD', 1, N'Mid-range SSD with 2TB capacity', CAST(200.00 AS Decimal(10, 2)), 68, N'\Images\2TB SSD.jpg', N'Available')
INSERT [dbo].[Products] ([ProductId], [ProductName], [CategoryId], [Description], [Price], [StockQuantity], [ImageUrl], [Status]) VALUES (N'89a9681b-0669-ef11-93bf-005056bdf33b', N'2TB HDD', 2, N'Reliable HDD with 2TB capacity', CAST(80.00 AS Decimal(10, 2)), 26, N'\Images\2TB HDD.jpg', N'Available')
INSERT [dbo].[Products] ([ProductId], [ProductName], [CategoryId], [Description], [Price], [StockQuantity], [ImageUrl], [Status]) VALUES (N'8aa9681b-0669-ef11-93bf-005056bdf33b', N'1TB HDD', 2, N'Affordable HDD with 1TB capacity', CAST(50.00 AS Decimal(10, 2)), 100, N'\Images\1TB HDD.jpg', N'Available')
INSERT [dbo].[Products] ([ProductId], [ProductName], [CategoryId], [Description], [Price], [StockQuantity], [ImageUrl], [Status]) VALUES (N'8ba9681b-0669-ef11-93bf-005056bdf33b', N'64GB Flash Drive', 3, N'Compact 64GB USB Flash Drive', CAST(15.00 AS Decimal(10, 2)), 196, N'\Images\64GB USB.jpg', N'Available')
INSERT [dbo].[Products] ([ProductId], [ProductName], [CategoryId], [Description], [Price], [StockQuantity], [ImageUrl], [Status]) VALUES (N'8ca9681b-0669-ef11-93bf-005056bdf33b', N'128GB Flash Drive', 3, N'High-capacity 128GB USB Flash Drive', CAST(25.00 AS Decimal(10, 2)), 150, N'\Images\128GB USB.jpg', N'Available')
INSERT [dbo].[Products] ([ProductId], [ProductName], [CategoryId], [Description], [Price], [StockQuantity], [ImageUrl], [Status]) VALUES (N'8da9681b-0669-ef11-93bf-005056bdf33b', N'32GB Memory Card', 4, N'32GB MicroSD Memory Card', CAST(10.00 AS Decimal(10, 2)), 297, N'\Images\32GB MicroSD.jpg', N'Available')
INSERT [dbo].[Products] ([ProductId], [ProductName], [CategoryId], [Description], [Price], [StockQuantity], [ImageUrl], [Status]) VALUES (N'8ea9681b-0669-ef11-93bf-005056bdf33b', N'64GB Memory Card', 4, N'64GB MicroSD Memory Card', CAST(20.00 AS Decimal(10, 2)), 248, N'\Images\64 GB MicroSD.jpg', N'Available')
GO
INSERT [dbo].[Roles] ([RoleId], [RoleName]) VALUES (N'9c06200d-5af1-4b14-bb74-9364b10977fe', N'Admin')
INSERT [dbo].[Roles] ([RoleId], [RoleName]) VALUES (N'0075b723-f0b5-4b6a-96a6-c46bc4eb4a98', N'Customer')
GO
INSERT [dbo].[Users] ([UserId], [Username], [PasswordHash], [Email], [RoleId], [CreatedDate], [IsActive]) VALUES (N'fd21a7b8-9b2e-4e51-8544-03a3b25c3bc8', N'janedoe', N'hashed_pw3', N'janedoe@gmail.com', N'0075b723-f0b5-4b6a-96a6-c46bc4eb4a98', CAST(N'2024-08-11T10:20:00.000' AS DateTime), 1)
INSERT [dbo].[Users] ([UserId], [Username], [PasswordHash], [Email], [RoleId], [CreatedDate], [IsActive]) VALUES (N'885cda8e-5aad-4155-f21c-08dccb2afd66', N'password', N'PHlZ6DVfGctsegI+RgmeXqnvI8xMdWddFTs2Yon6HR3xgTQimCW3UGTGpOhtl+P6brqu0sHajJNQACTDw/T/1A==', N'admin2@gmail.com', N'0075b723-f0b5-4b6a-96a6-c46bc4eb4a98', CAST(N'2024-09-02T14:11:07.973' AS DateTime), 1)
INSERT [dbo].[Users] ([UserId], [Username], [PasswordHash], [Email], [RoleId], [CreatedDate], [IsActive]) VALUES (N'6f6a7bf5-b2d8-47b1-f21d-08dccb2afd66', N'Admin', N'ao6ruUR+L9gXA1woLiJ11Poh+RQJ3Ucm6wcdNeZFQYGS/rO18MYP+DY0VIG883OePHKOkb2XqhkfksFIvkvsrg==', N'admin@gmail.com', N'9c06200d-5af1-4b14-bb74-9364b10977fe', CAST(N'2024-09-02T14:17:25.140' AS DateTime), 1)
INSERT [dbo].[Users] ([UserId], [Username], [PasswordHash], [Email], [RoleId], [CreatedDate], [IsActive]) VALUES (N'01553459-e8e7-4918-fcc5-08dccd76f5d4', N'mouni', N'xZtbc5w4dcomOI6ZqYkjgrbDk/MVhDuJiBulW783kNVTRZ5V4FCHm8AINfXCY2W7Qb6qd0xiMXoSMNh1BcUX3w==', N'mouni123@gmail.com', N'0075b723-f0b5-4b6a-96a6-c46bc4eb4a98', CAST(N'2024-09-05T12:19:59.317' AS DateTime), 1)
INSERT [dbo].[Users] ([UserId], [Username], [PasswordHash], [Email], [RoleId], [CreatedDate], [IsActive]) VALUES (N'628d848b-b29a-413e-57fa-08dcd0953734', N'Raju', N'ao6ruUR+L9gXA1woLiJ11Poh+RQJ3Ucm6wcdNeZFQYGS/rO18MYP+DY0VIG883OePHKOkb2XqhkfksFIvkvsrg==', N'raju123@gmail.com', N'0075b723-f0b5-4b6a-96a6-c46bc4eb4a98', CAST(N'2024-09-09T11:34:07.430' AS DateTime), 1)
INSERT [dbo].[Users] ([UserId], [Username], [PasswordHash], [Email], [RoleId], [CreatedDate], [IsActive]) VALUES (N'0b1ed149-5949-490e-8d62-31da234804ef', N'johndoe', N'hashed_pw2', N'johndoe@gmail.com', N'0075b723-f0b5-4b6a-96a6-c46bc4eb4a98', CAST(N'2024-08-11T10:10:00.000' AS DateTime), 1)
GO
ALTER TABLE [dbo].[CART] ADD  DEFAULT (newid()) FOR [CartId]
GO
ALTER TABLE [dbo].[Invoices] ADD  DEFAULT (newid()) FOR [InvoiceId]
GO
ALTER TABLE [dbo].[OrderDetails] ADD  DEFAULT (newsequentialid()) FOR [OrderDetailId]
GO
ALTER TABLE [dbo].[Orders] ADD  DEFAULT (newid()) FOR [OrderId]
GO
ALTER TABLE [dbo].[Products] ADD  DEFAULT (newsequentialid()) FOR [ProductId]
GO
ALTER TABLE [dbo].[Roles] ADD  DEFAULT (newid()) FOR [RoleId]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (newid()) FOR [UserId]
GO
ALTER TABLE [dbo].[CART]  WITH CHECK ADD FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([ProductId])
GO
ALTER TABLE [dbo].[CART]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Invoices]  WITH CHECK ADD FOREIGN KEY([OrderId])
REFERENCES [dbo].[Orders] ([OrderId])
GO
ALTER TABLE [dbo].[OrderDetails]  WITH CHECK ADD FOREIGN KEY([OrderId])
REFERENCES [dbo].[Orders] ([OrderId])
GO
ALTER TABLE [dbo].[OrderDetails]  WITH CHECK ADD FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([ProductId])
GO
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
ALTER TABLE [dbo].[Products]  WITH CHECK ADD FOREIGN KEY([CategoryId])
REFERENCES [dbo].[Categories] ([CategoryId])
GO
ALTER TABLE [dbo].[Users]  WITH CHECK ADD FOREIGN KEY([RoleId])
REFERENCES [dbo].[Roles] ([RoleId])
GO
USE [master]
GO
ALTER DATABASE [ComputerStorageSolutions] SET  READ_WRITE 
GO
