using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using ComputerStorageSolutions.Models;

namespace ComputerStorageSolutions.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Requires authentication
    public class CartController : ControllerBase
    {
        private readonly DataBaseConnect Database;
        private readonly ILogger<CartController> Logger;

        public CartController(DataBaseConnect _Database, ILogger<CartController> _Logger)
        {
            Database = _Database;
            Logger = _Logger;
        }

        // GET: api/Cart
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var userId = User.FindFirst("UserId")?.Value; // Assuming UserId is stored in claims
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var cartItems = Database.CartItems.Where(ci => ci.UserId == userId).ToList();
            return Ok(cartItems);
        }

        // POST: api/Cart
        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] CartItemDto cartItemDto)
        {
            var userId = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var existingCartItem = _context.CartItems.FirstOrDefault(ci => ci.UserId == userId && ci.ProductId == cartItemDto.ProductId);

            if (existingCartItem != null)
            {
                existingCartItem.Quantity += cartItemDto.Quantity;
            }
            else
            {
                var cartItem = new CartItem
                {
                    UserId = userId,
                    ProductId = cartItemDto.ProductId,
                    Quantity = cartItemDto.Quantity
                };
                _context.CartItems.Add(cartItem);
            }

            await _context.SaveChangesAsync();

            _logger.LogInformation("Product {ProductId} added to cart for user {UserId}.", cartItemDto.ProductId, userId);

            return Ok();
        }

        // PUT: api/Cart/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCartItem(int id, [FromBody] CartItemDto cartItemDto)
        {
            var userId = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var cartItem = _context.CartItems.FirstOrDefault(ci => ci.Id == id && ci.UserId == userId);
            if (cartItem == null)
            {
                return NotFound();
            }

            cartItem.Quantity = cartItemDto.Quantity;
            await _context.SaveChangesAsync();

            _logger.LogInformation("Cart item {CartItemId} updated for user {UserId}.", id, userId);

            return Ok(cartItem);
        }

        // DELETE: api/Cart/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var userId = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var cartItem = _context.CartItems.FirstOrDefault(ci => ci.Id == id && ci.UserId == userId);
            if (cartItem == null)
            {
                return NotFound();
            }

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Cart item {CartItemId} removed for user {UserId}.", id, userId);

            return Ok();
        }
    }

    // DTO (Data Transfer Object) for cart items
    public class CartItem
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
