using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ComputerStorageSolutions.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly DataBaseConnect Database;
        private readonly ILogger<CartController> Logger;

        public CartController(DataBaseConnect _Database, ILogger<CartController> _Logger)
        {
            Database = _Database;
            Logger = _Logger;
        }

        [HttpGet("GetCart")]
        [Authorize]
        public async Task<ActionResult> GetCart(Guid userId)
        {
            Console.WriteLine(userId);
            var cartItems = await (from cart in Database.Carts
                                   where cart.UserId == userId
                                   select new { cart.ProductId, cart.Quantity }).ToListAsync();

            if (cartItems.Count == 0)
            {
                Logger.LogInformation("Cart not found for user ID: {UserId}", userId);
                return NotFound("Cart not found.");
            }

            return Ok(cartItems);
        }

        // POST: api/Cart/{userId}
        [HttpPost("AddToCart")]
        [Authorize]
        public async Task<ActionResult> AddItemToCart(Guid userId, [FromBody] Guid productId)
        {
            // Check if the product already exists in the cart
            var existingCartItem = await Database.Carts
                .FirstOrDefaultAsync(item => item.UserId == userId && item.ProductId == productId);

            if (existingCartItem != null)
            {
                // If the item already exists, increment the quantity by 1
                existingCartItem.Quantity += 1;
            }
            else
            {
                // Add a new item to the cart with a default quantity of 1
                var newCartItem = new CartModel
                {
                    UserId = userId,
                    ProductId = productId,
                    Quantity = 1
                };

                Database.Carts.Add(newCartItem);
            }

            // Save changes to the database
            await Database.SaveChangesAsync();
            Logger.LogInformation("Item added to cart for user ID: {UserId}", userId);

            return Ok("Item added to cart.");
        }
        // PUT: api/Cart/{userId}/items/{productId}
        [HttpPut("UpdateCart")]
        [Authorize]
        public async Task<ActionResult> UpdateCartItem(Guid userId, Guid productId, [FromBody] int quantity)
        {
            // Validate quantity
            if (quantity <= 0)
            {
                Logger.LogWarning("Invalid quantity received for product ID: {ProductId} and user ID: {UserId}", productId, userId);
                return BadRequest("Quantity cannot be less than 0.");
            }

            var existingCartItem = await Database.Carts
                .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

            if (existingCartItem == null)
            {
                Logger.LogInformation("Item not found in cart for product ID: {ProductId} and user ID: {UserId}", productId, userId);
                return NotFound("Item not found in cart.");
            }

            else 
            { 
                // Update the quantity, limiting it to a maximum of 10
                if (quantity > 10)
                {
                    quantity = 10;
                    Logger.LogInformation("Item quantity updated to the maximum limit of 10 for product ID: {ProductId} and user ID: {UserId}", productId, userId);
                    existingCartItem.Quantity = quantity;
                    await Database.SaveChangesAsync();
                    return Ok("Quantity updated to the maximum limit of 10.");
                }
                else
                {
                    existingCartItem.Quantity = quantity;
                    await Database.SaveChangesAsync();
                    Logger.LogInformation("Item quantity updated to {Quantity} in cart for product ID: {ProductId} and user ID: {UserId}", quantity, productId, userId);
                    return Ok("Cart item updated successfully.");
                }
            }
        }


        // DELETE: api/Cart/{userId}/items/{productId}
        [HttpDelete("RemoveItemFromCart")]
        [Authorize]
        public async Task<ActionResult> RemoveItemFromCart(Guid userId, Guid productId)
        {
            var cartItem = await Database.Carts
                .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

            if (cartItem == null)
            {
                Logger.LogInformation("Item not found in cart for product ID: {ProductId}", productId);
                return NotFound("Item not found in cart.");
            }

            Database.Carts.Remove(cartItem);
            await Database.SaveChangesAsync();
            Logger.LogInformation("Item removed from cart for user ID: {UserId}", userId);

            return Ok();
        }

        // DELETE: api/Cart/{userId}
        [HttpDelete("DeleteCart")]
        [Authorize]
        public async Task<ActionResult> ClearCart(Guid userId)
        {
            var cartItems = await Database.Carts
                .Where(c => c.UserId == userId)
                .ToListAsync();

            if (cartItems.Count == 0)
            {
                Logger.LogInformation("Cart not found for user ID: {UserId}", userId);
                return NotFound("Cart not found.");
            }

            Database.Carts.RemoveRange(cartItems);
            await Database.SaveChangesAsync();
            Logger.LogInformation("Cart cleared for user ID: {UserId}", userId);

            return Ok("Cart cleared.");
        }
    }
    
}
