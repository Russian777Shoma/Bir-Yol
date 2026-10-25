# BirYol — kliklənən travel discovery prototipi

Azərbaycan üzrə destinasiya kəşfi + Travel Rooms axınını tam kliklənən, responsive frontend prototip kimi qururuq. Real baza, auth, ödəniş yoxdur — bütün məlumat nümunə datadır və uyğun yerlərdə "Nümunə məlumat" label-i görünür.

## Səhifələr və CTA axını

| Səhifə | Route | Əsas CTA | Keçid |
| --- | --- | --- | --- |
| Home / Explore | `/` | Kəşf et | `/destinasiya/$slug` |
| Destination Detail | `/destinasiya/$slug` | Səyahət yoldaşı tap | `/destinasiya/$slug/rooms` |
| Category Listings | `/destinasiya/$slug/$category` | Detallara bax | listing detail state (modal/panel) |
| Travel Rooms + Room Detail | `/destinasiya/$slug/rooms` (`?room=` ilə detail) | Room-a bax → Request göndər | success state |
| Room yarat | `/room-yarat` | Room yarat | "Room yaradıldı" success state |

## Məzmun

- 8 destinasiya: Qəbələ, Şəki, Quba, Lənkəran, Şamaxı, Naftalan, Bakı, Qusar. Hamısı **eyni reusable struktur** ilə işləyir; Qəbələ sadəcə nümunədir.
- Hər destinasiya üçün: hero (ad, qısa təsvir), 4 kateqoriya (Otellər, Əyləncələr, Turlar, Səyahət yoldaşı), 3 otel kartı (ad, rating, lokasiya, başlanğıc qiymət, 2-3 xüsusiyyət), əyləncələr (zipline, kvadrosikl, at sürmə, təbiət gəzintisi, muzey, boat tour) qiymətlə, lokal tur təklifləri.
- Hər destinasiyada ≥3 Travel Room: ad, host adı, tarix, iştirakçı x/y, büdcə aralığı, dil, yaş şərti, qısa description, "Request ilə" status badge.
- Room Detail: host kriteriyaları ayrı kartda, 5 günlük nümunə trip plan, Join Request formu (Ad, Yaş, Təxmini büdcə, Səyahət tarixi, Qısa mesaj), default "İstifadəçi A". Real şəxsi məlumat istənmir.

## Interaction və form davranışı

- Home-da search field autocomplete-siz sadə uyğunlaşma ilə destinasiya təklif edir; seçim + "Kəşf et" detail səhifəsinə aparır. Mobil ekranda input və düymə vertikal düzülür.
- Category Listings filtrləri (Qiymət, Rating, Kateqoriya, Məsafə, Ailə üçün, Aktivlik tipi) və Travel Rooms filtrləri (Tarix, Büdcə, Qrup ölçüsü, Dil, Yaş) yalnız frontend chip/select state kimi işləyir — nəticə siyahısını dəyişmirlər, seçildikləri görünür.
- Join Request və Room yarat formları zod + react-hook-form ilə validasiya olunur: boş required sahədə inline "Bu sahə boş qala bilməz." mesajı, uğurlu göndərişdə page reload olmadan success state ("Request göndərildi" / "Room yaradıldı") və "Room-lara qayıt" düyməsi.
- Hər səhifədə header + UI daxilində aydın geri keçid (breadcrumb / "Geri" düyməsi).

## Dizayn (brandbook-a uyğun)

- Tokenlər `src/styles.css`-də semantik dəyər kimi: primary teal `#0F766E` (hover `#115E59`, soft `#CCFBF1`), accent coral `#F97316` (soft `#FFF7ED`), ink `#1F2937`, muted `#64748B`, line `#E2E8F0`, surface `#F8FAFC`, success/warn/error və onların soft variantları. Brandbook-un dark palitrası (`#2DD4BF`, `#0F172A`, `#111827` və s.) dark rejim üçün eyni tokenlərə yazılır.
- Radiuslar 8/12/18/24px + pill, yüngül shadow, geniş whitespace, aydın kart iyerarxiyası. Teal = primary CTA, coral = sosial/Travel Room accent.
- Tipoqrafiya: başlıqlar Manrope (700/800), body/UI DM Sans (400-700) — root route head-də `<link>` ilə yüklənir.
- Travel şəkilləri: hero və kart görselləri üçün destinasiyalara uyğun generasiya olunmuş şəkillər (teal→coral gradient fallback brandbook üslubunda).
- TripAdvisor-dan yalnız discovery patterni; vizual kopyalanmır.

## Light / Dark mode

Tam themeləmə: header, nav, kartlar, inputlar, düymələr, dropdown-lar, Travel Room kartları, alert-lər, badge-lər, form error/success state-ləri, borderlər, tipoqrafiya, destination bölmələri. Seçim `localStorage`-də saxlanılır (`biryol-theme`), ilk render-də hydration mismatch olmadan tətbiq olunur.

## Responsive

Desktop 12-sütun grid; tablet 1-2 sütun; mobil əsasən 1 sütun, kateqoriyalar 2×2, search vertikal. Horizontal overflow yoxdur, uzun Azərbaycan mətnləri kartdan daşmır (`min-w-0` + truncate/wrap), touch target ≥44px, header mobil menyu (sheet) kimi açılır.

## Texniki detallar

- TanStack Start route faylları: `src/routes/index.tsx`, `destinasiya.$slug.tsx`, `destinasiya.$slug.index.tsx`, `destinasiya.$slug.$category.tsx`, `destinasiya.$slug.rooms.tsx`, `room-yarat.tsx`. Hər səhifə öz `head()` metadatası ilə.
- Nümunə data `src/data/destinations.ts` + `src/data/rooms.ts`-də tipli sabitlər kimi; heç bir şəbəkə sorğusu yoxdur.
- Ortaq komponentlər: `SiteHeader`, `ThemeToggle`, `SampleBadge` ("Nümunə məlumat"), `DestinationCard`, `ListingCard`, `RoomCard`, `FilterBar`, `RoomDetailPanel`, `JoinRequestForm`.
- Room detail eyni route daxilində `?room=` search param ilə detail state kimi işləyir (5 səhifə limitinə uyğun, deep-link mümkün).
- Backend, Lovable Cloud, auth əlavə edilmir.

## Sonda

Prototip hazır olanda səhifə adları, hər səhifənin əsas CTA-sı və keçidi, mobil görünüşdə yoxlanacaq elementlər və form validasiyasının test yerləri qısa siyahı kimi verilir.
