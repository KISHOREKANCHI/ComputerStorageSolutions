using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
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
            try
            {
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
            catch (Exception ex)
            {
                Logger.LogError(ex, "An error Internal occurred while retrieving the cart for user ID: {UserId}", userId);
                return StatusCode(500, "An Internal server error occurred while processing your request.");
            }
        }

        [HttpPost("AddToCart")]
        [Authorize]
        public async Task<ActionResult> AddItemToCart(Guid userId, [FromBody] Guid productId)
        {
            try
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
            catch (Exception ex)
            {
                Logger.LogError(ex, "An Internal error occurred while adding item to the cart for user ID: {UserId}", userId);
                return StatusCode(500, "An Internal server error occurred while processing your request.");
            }
        }

        [HttpPut("UpdateCart")]
        [Authorize]
        public async Task<ActionResult> UpdateCartItem(Guid userId, Guid productId, [FromBody] int quantity)
        {
            try
            {
                // Validate quantity
                if (quantity <= 0)
                {
                    Logger.LogWarning("Invalid quantity received for product ID: {ProductId} and user ID: {UserId}", productId, userId);
                    return BadRequest("Quantity cannot be less than 1.");
                }

                var existingCartItem = await Database.Carts
                    .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

                if (existingCartItem == null)
                {
                    Logger.LogInformation("Item not found in cart for product ID: {ProductId} and user ID: {UserId}", productId, userId);
                    return NotFound("Item not found in cart.");
                }

                // Update the quantity, limiting it to a maximum of 10
                if (quantity > 10)
                {
                    quantity = 10;
                    Logger.LogInformation("Item quantity updated to the maximum limit of 10 for product ID: {ProductId} and user ID: {UserId}", productId, userId);
                }

                existingCartItem.Quantity = quantity;
                await Database.SaveChangesAsync();
                Logger.LogInformation("Item quantity updated to {Quantity} in cart for product ID: {ProductId} and user ID: {UserId}", quantity, productId, userId);

                return Ok("Cart item updated successfully.");
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "An Internal error occurred while updating the cart item for product ID: {ProductId} and user ID: {UserId}", productId, userId);
                return StatusCode(500, "An Internal server error occurred while processing your request.");
            }
        }

        [HttpDelete("RemoveItemFromCart")]
        [Authorize]
        public async Task<ActionResult> RemoveItemFromCart(Guid userId, Guid productId)
        {
            try
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
            catch (Exception ex)
            {
                Logger.LogError(ex, "An Internal error occurred while removing item from the cart for product ID: {ProductId} and user ID: {UserId}", productId, userId);
                return StatusCode(500, "An Internal server error occurred while processing your request.");
            }
        }

        [HttpDelete("DeleteCart")]
        [Authorize]
        public async Task<ActionResult> ClearCart(Guid userId)
        {
            try
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
            catch (Exception ex)
            {
                Logger.LogError(ex, "An Internal error occurred while clearing the cart for user ID: {UserId}", userId);
                return StatusCode(500, "An Internal server error occurred while processing your request.");
            }
        }
    }
}
