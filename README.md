# Kişisel Dil Öğrenme Asistanı

Bu proje, IELTS, TOEFL ve YDS gibi sınavlara hazırlanan öğrenciler için özel olarak tasarlanmış, yapay zeka destekli dil öğrenme platformudur. Kullanıcılar, sınavlarının gereksinimlerine uygun içeriklere ulaşarak dil becerilerini geliştirirken, yapay zeka tarafından üretilen cümle örnekleri ve kelime kullanım analizleri sayesinde kendilerine özgü öğrenme stratejileri oluşturabileceklerdir. Platform, mobil ve web ortamında, cross platform desteğiyle öğrencilerin her yerden erişimine imkan tanıyacaktır.

## İlk Hafta Yapılanlar

1. Proje temel yapısının oluşturulması
2. Temel konfigürasyon dosyalarının ayarlanması:
   - Editor konfigürasyonu (.editorconfig)
   - Git yapılandırması (.gitignore, .gitattributes)
   - Kod formatı ayarları (.prettierrc)
   - Paket yönetimi (package.json)
3. Temel uygulama altyapısının kurulması:
   - Proje dizin yapısının oluşturulması (src/)
   - Temel HTML yapısının hazırlanması
   - JavaScript dosyalarının oluşturulması
4. Kullanıcı arayüzü bileşenlerinin geliştirilmesi:
   - Kelime ekleme formu
   - Kelime listesi görünümü
   - Temel stil ve düzen ayarları

## İkinci Hafta Yapılanlar

1. Web Components teknolojisi ile UI bileşenlerinin geliştirilmesi:
   - WordCard bileşeni (kelime kartı görünümü)
   - WordList bileşeni (kelime listesi yönetimi)
   - Custom Events ile bileşenler arası iletişim
2. Kelime yönetimi için API servisinin oluşturulması:
   - RESTful API endpoints
   - CRUD operasyonları için servis katmanı
   - Veri modeli ve validasyon
3. Kullanıcı arayüzünün modernizasyonu:
   - Responsive tasarım iyileştirmeleri
   - Material Design prensiplerinin uygulanması
   - Kullanıcı deneyimi optimizasyonları
4. Event-driven mimari implementasyonu:
   - Bileşenler arası veri akışı
   - State yönetimi
   - Olay yakalama ve işleme mekanizmaları

## Geliştirme

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

## Lisans

Bu proje [MIT](https://opensource.org/licenses/MIT) lisansı altında yayınlanmıştır.