using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ChatApi.Data;
using ChatApi.Models;
using ChatApi.Services;

namespace ChatApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly SentimentService _sentimentService;

        public MessagesController(AppDbContext context, SentimentService sentimentService)
        {
            _context = context;
            _sentimentService = sentimentService;
        }

        
        [HttpPost]
        public async Task<ActionResult<Message>> CreateMessage([FromBody] CreateMessageRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Text))
            {
                return BadRequest("Mesaj metni boş olamaz");
            }

            
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null)
            {
                return BadRequest("Kullanıcı bulunamadı");
            }

      
            var sentiment = await _sentimentService.AnalyzeSentiment(request.Text);

           
            var message = new Message
            {
                UserId = request.UserId,
                Text = request.Text,
                SentimentLabel = sentiment.Label,
                SentimentScore = sentiment.Score
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            
            message.User = user;

            return CreatedAtAction(nameof(GetMessage), new { id = message.Id }, message);
        }

        
        [HttpGet("{id}")]
        public async Task<ActionResult<Message>> GetMessage(int id)
        {
            var message = await _context.Messages
                .Include(m => m.User)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (message == null)
            {
                return NotFound();
            }

            return message;
        }

       
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Message>>> GetMessages()
        {
            return await _context.Messages
                .Include(m => m.User)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }
    }

    public class CreateMessageRequest
    {
        public int UserId { get; set; }
        public string Text { get; set; } = string.Empty;
    }
}