using System.Text;
using System.Text.Json;

namespace ChatApi.Services
{
    public class SentimentService
    {
        private readonly HttpClient _httpClient;
        private readonly string _huggingFaceUrl;

        public SentimentService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            
            _huggingFaceUrl = configuration["HuggingFace:ApiUrl"] ?? "";
        }

        public async Task<SentimentResult> AnalyzeSentiment(string text)
        {
            try
            {
                var requestData = new
                {
                    data = new[] { text }
                };

                var json = JsonSerializer.Serialize(requestData);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(_huggingFaceUrl, content);
                response.EnsureSuccessStatusCode();

                var responseJson = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<HuggingFaceResponse>(responseJson);

                if (result?.data != null && result.data.Length > 0)
                {
                    var sentimentData = result.data[0];
                    return new SentimentResult
                    {
                        Label = sentimentData.label ?? "neutral",
                        Score = sentimentData.score
                    };
                }

                return new SentimentResult { Label = "neutral", Score = 0.0 };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Sentiment analizi hatası: {ex.Message}");
                return new SentimentResult { Label = "neutral", Score = 0.0 };
            }
        }
    }

    public class SentimentResult
    {
        public string Label { get; set; } = string.Empty;
        public double Score { get; set; }
    }


    public class HuggingFaceResponse
    {
        public SentimentData[]? data { get; set; }
    }

    public class SentimentData
    {
        public string? label { get; set; }
        public double score { get; set; }
    }
}