import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  private apiUrl = 'http://localhost:4200/Statistics'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchTotalSalesMonthWise();
    this.fetchTotalOrdersPlacedByCustomerMonthWise();
    this.fetchOrdersPlacedByCustomerInSpecificMonth();
    this.fetchInactiveCustomers();
    this.fetchUnitsSoldInPriceRange();
    this.fetchPopularProductDetailsForMonth();
    this.fetchLeastPopularProductDetailsForMonth();
    this.fetchCustomerAndProductsOrderedInQuarter();
    this.fetchOrderIdAndCustomerDetailsForHighestSellingProduct();
  }

  fetchTotalSalesMonthWise(): void {
    this.http.get<{ month: string, totalSales: number }[]>(`${this.apiUrl}/total-sales-month-wise`)
      .subscribe(data => {
        this.initializeChart('totalSalesChart', 'Total Sales Month-Wise', data, 'month', 'totalSales');
      });
  }

  fetchTotalOrdersPlacedByCustomerMonthWise(): void {
    this.http.get<{ month: string, totalOrders: number }[]>(`${this.apiUrl}/total-orders-customer-month-wise`)
      .subscribe(data => {
        this.initializeChart('totalOrdersChart', 'Total Orders Placed by Customer Month-Wise', data, 'month', 'totalOrders');
      });
  }

  fetchOrdersPlacedByCustomerInSpecificMonth(): void {
    const customerId = '9c06200d-5af1-4b14-bb74-9364b10977fe'; 
    const month = 'March'; 
    this.http.get<{ date: string, orderCount: number }[]>(`${this.apiUrl}/orders-by-customer-in-month/${customerId}/${month}`)
      .subscribe(data => {
        this.initializeChart('ordersByCustomerChart', `Orders by Customer in ${month}`, data, 'date', 'orderCount');
      });
  }

  fetchInactiveCustomers(): void {
    this.http.get<{ customerId: string, customerName: string }[]>(`${this.apiUrl}/inactive-customers-last-3-months`)
      .subscribe(data => {
        this.initializeList('inactiveCustomersList', 'Customers Inactive for Last 3 Months', data, 'customerName');
      });
  }

  fetchUnitsSoldInPriceRange(): void {
    const minPrice = 50; // Replace with actual minimum price
    const maxPrice = 150; // Replace with actual maximum price
    this.http.get<{ productName: string, unitsSold: number }[]>(`${this.apiUrl}/units-sold-in-price-range/${minPrice}/${maxPrice}`)
      .subscribe(data => {
        this.initializeChart('unitsSoldChart', `Units Sold in Price Range ${minPrice} - ${maxPrice}`, data, 'productName', 'unitsSold');
      });
  }

  fetchPopularProductDetailsForMonth(): void {
    const month = 'March';
    this.http.get<{ productName: string, sales: number }[]>(`${this.apiUrl}/popular-product-details/${month}`)
      .subscribe(data => {
        this.initializeChart('popularProductChart', `Most Popular Product in ${month}`, data, 'productName', 'sales');
      });
  }

  fetchLeastPopularProductDetailsForMonth(): void {
    const month = 'March'; 
    this.http.get<{ productName: string, sales: number }[]>(`${this.apiUrl}/least-popular-product-details/${month}`)
      .subscribe(data => {
        this.initializeChart('leastPopularProductChart', `Least Popular Product in ${month}`, data, 'productName', 'sales');
      });
  }

  fetchCustomerAndProductsOrderedInQuarter(): void {
    const quarter = 'Q1'; // Replace with the specific quarter (Q1, Q2, Q3, Q4)
    this.http.get<{ customerName: string, products: string }[]>(`${this.apiUrl}/customer-products-ordered-in-quarter/${quarter}`)
      .subscribe(data => {
        this.initializeList('customerProductsQuarterList', `Customer and Products Ordered in ${quarter}`, data, 'customerName', 'products');
      });
  }

  fetchOrderIdAndCustomerDetailsForHighestSellingProduct(): void {
    this.http.get<{ orderId: string, customerName: string }[]>(`${this.apiUrl}/order-details-highest-selling-product`)
      .subscribe(data => {
        this.initializeList('highestSellingProductList', 'Order ID and Customer Details for Highest Selling Product', data, 'orderId', 'customerName');
      });
  }

  initializeChart(chartId: string, label: string, data: any[], labelKey: string, dataKey: string): void {
    new Chart(
      chartId,
      {
        type: 'bar',
        data: {
          labels: data.map(row => row[labelKey]),
          datasets: [
            {
              label: label,
              data: data.map(row => row[dataKey]),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              beginAtZero: true
            },
            y: {
              beginAtZero: true
            }
          }
        }
      }
    );
  }

  initializeList(listId: string, label: string, data: any[], labelKey: string, valueKey?: string): void {
    const listElement = document.getElementById(listId);
    if (listElement) {
      listElement.innerHTML = `<h3>${label}</h3>`;
      data.forEach(item => {
        const listItem = document.createElement('div');
        listItem.innerText = valueKey ? `${item[labelKey]}: ${item[valueKey]}` : `${item[labelKey]}`;
        listElement.appendChild(listItem);
      });
    }
  }
}
