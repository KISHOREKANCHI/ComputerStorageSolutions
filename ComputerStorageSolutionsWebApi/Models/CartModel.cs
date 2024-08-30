using ComputerStorageSolutions.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class CartModel
{
    [Key]
    public Guid CartId { get; set; }  

    [ForeignKey(nameof(Users))]
    public Guid UserId { get; set; }

    [ForeignKey(nameof(Products))]
    public Guid ProductId { get; set; }

    [Required]
    public int Quantity { get; set; }

    [JsonIgnore]
    public virtual UserModel? Users { get; set; }

    [JsonIgnore]
    public virtual ProductsModel? Products { get; set; }
}