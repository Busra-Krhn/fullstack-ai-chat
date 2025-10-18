namespace ChatApi.Models
{
    public class Message
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Text { get; set; } = string.Empty;
        public string SentimentLabel { get; set; } = string.Empty;
        public double SentimentScore { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public User? User { get; set; }
    }
}