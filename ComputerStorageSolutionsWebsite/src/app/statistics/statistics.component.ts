import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { ApiServiceService } from '../Services/api-service.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  constructor(private apiService: ApiServiceService) {}

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
    this.apiService.getTotalSalesMonthWise().subscribe(data => {
      console.log('Total Sales Month-Wise Data:', data);
      this.initializeChart('totalSalesChart', 'Total Sales Month-Wise', data, 'month', 'totalSales');
    });
  }

  fetchTotalOrdersPlacedByCustomerMonthWise(): void {
    this.apiService.getTotalOrdersByCustomerMonthWise().subscribe(data => {
      console.log('Total Orders Placed by Customer Month-Wise Data:', data);
      this.initializeChart('totalOrdersChart', 'Total Orders Placed by Customer Month-Wise', data, 'month', 'totalOrders');
    });
  }

  fetchOrdersPlacedByCustomerInSpecificMonth(): void {
    const customerId = '9c06200d-5af1-4b14-bb74-9364b10977fe';
    const month = 'March';
    this.apiService.getOrdersByCustomerInSpecificMonth(customerId, month).subscribe(data => {
      console.log(`Orders by Customer in ${month} Data:`, data);
      this.initializeChart('ordersByCustomerChart', `Orders by Customer in ${month}`, data, 'date', 'orderCount');
    });
  }

  fetchInactiveCustomers(): void {
    this.apiService.getInactiveCustomers().subscribe(data => {
      console.log('Inactive Customers Data:', data);
      this.initializeList('inactiveCustomersList', 'Customers Inactive for Last 3 Months', data, 'customerName');
    });
  }

  fetchUnitsSoldInPriceRange(): void {
    const minPrice = 50;
    const maxPrice = 150;
    this.apiService.getUnitsSoldInPriceRange(minPrice, maxPrice).subscribe(data => {
      console.log(`Units Sold in Price Range ${minPrice} - ${maxPrice} Data:`, data);
      this.initializeChart('unitsSoldChart', `Units Sold in Price Range ${minPrice} - ${maxPrice}`, data, 'productName', 'unitsSold');
    });
  }

  fetchPopularProductDetailsForMonth(): void {
    const month = 'March';
    this.apiService.getPopularProductDetailsForMonth(month).subscribe(data => {
      console.log(`Most Popular Product in ${month} Data:`, data);
      this.initializeChart('popularProductChart', `Most Popular Product in ${month}`, data, 'productName', 'sales');
    });
  }

  fetchLeastPopularProductDetailsForMonth(): void {
    const month = 'March';
    this.apiService.getLeastPopularProductDetailsForMonth(month).subscribe(data => {
      console.log(`Least Popular Product in ${month} Data:`, data);
      this.initializeChart('leastPopularProductChart', `Least Popular Product in ${month}`, data, 'productName', 'sales');
    });
  }

  fetchCustomerAndProductsOrderedInQuarter(): void {
    const quarter = 'Q1';
    this.apiService.getCustomerProductsOrderedInQuarter(quarter).subscribe(data => {
      console.log(`Customer and Products Ordered in ${quarter} Data:`, data);
      this.initializeList('customerProductsQuarterList', `Customer and Products Ordered in ${quarter}`, data, 'customerName', 'products');
    });
  }

  fetchOrderIdAndCustomerDetailsForHighestSellingProduct(): void {
    this.apiService.getOrderIdAndCustomerDetailsForHighestSellingProduct().subscribe(data => {
      console.log('Order ID and Customer Details for Highest Selling Product Data:', data);
      this.initializeList('highestSellingProductList', 'Order ID and Customer Details for Highest Selling Product', data, 'orderId', 'customerName');
    });
  }

  initializeChart(chartId: string, label: string, data: any[], labelKey: string, dataKey: string): void {
    const ctx = document.getElementById(chartId) as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(row => row[labelKey]),
          datasets: [{
            label: label,
            data: data.map(row => row[dataKey]),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: { beginAtZero: true },
            y: { beginAtZero: true }
          }
        }
      });
    }
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
