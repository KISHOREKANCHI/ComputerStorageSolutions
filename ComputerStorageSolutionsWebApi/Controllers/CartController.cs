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

        // GET: api/Cart/{userId}
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<Cart>>> GetCart(int userId)
        {
            var cartItems = await (from cart in Database.Carts
                                   where cart.UserId == userId
                                   select new { cart.ProductId, cart.Quantity }).ToListAsync()

            if (cartItems.Count == 0)
            {
                Logger.LogInformation("Cart not found for user ID: {UserId}", userId);
                return NotFound("Cart not found.");
            }

            return Ok(cartItems);
        }

        // POST: api/Cart/{userId}
        [HttpPost("{userId}")]
        public async Task<ActionResult> AddItemToCart(int userId, [FromBody] Cart cartItem)
        {
            // Check if the item already exists in the cart
            var existingCartItem = await Database.Carts
                .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == cartItem.ProductId);

            if (existingCartItem != null)
            {
                // Update the quantity and total price
                existingCartItem.Quantity += cartItem.Quantity;
                // Assuming `UnitPrice` is not in the single table, if so, you may need additional logic to update `TotalPrice`
            }
            else
            {
                // Add new cart item
                cartItem.UserId = userId;
                Database.Carts.Add(cartItem);
            }

            await Database.SaveChangesAsync();
            Logger.LogInformation("Item added to cart for user ID: {UserId}", userId);

            return Ok();
        }

        // PUT: api/Cart/{userId}/items/{productId}
        [HttpPut("{userId}/items/{productId}")]
        public async Task<ActionResult> UpdateCartItem(int userId, int productId, [FromBody] CartItem updatedItem)
        {
            var existingCartItem = await Database.Carts
                .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

            if (existingCartItem == null)
            {
                Logger.LogInformation("Item not found in cart for product ID: {ProductId}", productId);
                return NotFound("Item not found in cart.");
            }

            existingCartItem.Quantity = updatedItem.Quantity;
            // Update `TotalPrice` if needed

            await Database.SaveChangesAsync();
            Logger.LogInformation("Item updated in cart for user ID: {UserId}", userId);

            return Ok();
        }

        // DELETE: api/Cart/{userId}/items/{productId}
        [HttpDelete("{userId}/items/{productId}")]
        public async Task<ActionResult> RemoveItemFromCart(int userId, int productId)
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
        [HttpDelete("{userId}")]
        public async Task<ActionResult> ClearCart(int userId)
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
