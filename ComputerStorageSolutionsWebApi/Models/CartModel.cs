public class Cart
{
    public int CartId { get; set; }  // Not used in this single-table approach, might be replaced by other fields
    public int UserId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    // Assuming UnitPrice and TotalPrice are not part of the CartItem model in this approach
    // If they are needed, consider adding them to the CartItem class
}