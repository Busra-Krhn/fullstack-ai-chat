# 💬 AI Chat Uygulaması - Stajyer Projesi

Mesajların duygu durumunu AI ile analiz eden chat uygulaması. Kullanıcılar mesaj attığında AI pozitif/negatif/nötr olduğunu söylüyor.

## Ne Yaptım?

- Kullanıcı rumuz giriyor
- Mesaj yazıyor
- AI mesajın duygusunu analiz ediyor (mutlu/üzgün/normal)
- Sonuç ekranda gösteriliyor

## Kullanılan Teknolojiler

**Web (Frontend):**
- React - Kullanıcı arayüzü için

**Backend (API):**
- .NET Core - API ve veritabanı için
- SQLite - Mesajları saklamak için

**AI:**
- Python + Hugging Face - Duygu analizi için
- Model: nlptown/bert-base-multilingual-uncased-sentiment

## Klasör Yapısı

```
fullstack-ai-chat/
├── frontend/chat-web/      # React web uygulaması
├── backend/ChatApi/        # .NET API
└── ai-service/             # Python AI (Hugging Face'te)
```

## Nasıl Çalıştırılır?

### 1. AI Servisi
1. Hugging Face'te hesap aç
2. Space oluştur (Gradio)
3. `app.py` ve `requirements.txt` yükle

### 2. Backend
```bash
cd backend/ChatApi
dotnet run
```
http://localhost:5157 adresinde çalışır

### 3. Web
```bash
cd frontend/chat-web
npm install
npm start
```
http://localhost:3000 adresinde açılır

## Dosyaların Ne İşe Yaradığı

### Frontend
- `App.js` - Ana sayfa, chat ekranı, mesaj gönderme
- `App.css` - Görünüm ve renkler

### Backend
- `UsersController.cs` - Kullanıcı kayıt API'si
- `MessagesController.cs` - Mesaj gönder/listele API'si
- `SentimentService.cs` - Hugging Face'e istek atıp duygu analizi alıyor
- `User.cs` ve `Message.cs` - Veritabanı tabloları
- `AppDbContext.cs` - SQLite bağlantısı

### AI Servisi
- `app.py` - Hugging Face'te çalışan duygu analizi API'si
- `requirements.txt` - Gerekli Python kütüphaneleri

## AI Araçları Kullanımı

Bu projede **Claude AI** kullandım:

**AI ile Yazılan Kodlar:**
- Bazı React komponenti (App.js)
- .NET API controller'lar
- Python duygu analizi kodu
- Veritabanı servis kodları

**Kendim Yazdıklarım:**
- CSS tasarımı (App.css)
- Backend ve frontend'i birbirine bağlamak
- Hataları bulmak ve düzeltmek
- AI'nin yazdığı kodları test etmek

## Nasıl Çalışıyor?

1. Kullanıcı rumuz girer
2. Mesaj yazar
3. Backend mesajı alır
4. Hugging Face AI'ye gönderir
5. AI duygu analizini yapar (5 stars = mutlu, 1 star = üzgün)
6. Sonuç veritabanına kaydedilir
7. Ekranda emoji + skor gösterilir

## Demo Linkler
- **Web Uygulaması:** https://fullstack-chat-ai.vercel.app  
- **Backend API:** https://fullstack-ai-chat-3drl.onrender.com  
- **AI Servisi (Hugging Face):** https://huggingface.co/spaces/rabusra/sentiment_analysis_api_

## Öğrendiklerim

- React ile frontend geliştirme
- .NET Core ile API yapma
- SQLite veritabanı kullanımı
- AI model entegrasyonu (Hugging Face)
- Full-stack uygulama geliştirme süreci

## Yapımcı

Büşra Karahan - Full Stack + AI Stajyer Projesigit add README.md
