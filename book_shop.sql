-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Фев 26 2025 г., 18:49
-- Версия сервера: 10.4.32-MariaDB
-- Версия PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `book_shop`
--

-- --------------------------------------------------------

--
-- Структура таблицы `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `imageUrl` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `price` decimal(9,2) DEFAULT NULL,
  `genre` varchar(50) DEFAULT NULL,
  `views` int(11) DEFAULT 0,
  `superprice` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `books`
--

INSERT INTO `books` (`id`, `name`, `author`, `description`, `imageUrl`, `link`, `created_at`, `price`, `genre`, `views`, `superprice`) VALUES
(5, 'Dziewczyna, która prześcignęła czas', 'Anna Benning', 'Trylogia „Vortex” Anny Benning to niesamowita podróż przez całkowicie nowe uniwersum.', 'https://s.lubimyczytac.pl/upload/books/4997000/4997961/952056-352x500.jpg', '/book1', '2024-12-22 14:37:52', 32.00, 'Fantazy', 3, 20.00),
(6, 'Wiedźmin. Rozdroże kruków', 'Sapkowski Andrzej', 'Trylogia „Vortex” Anny Benning to niesamowita podróż przez całkowicie nowe uniwersum.', 'https://ecsmedia.pl/cdn-cgi/image/format=webp,width=544,height=544,/c/wiedzmin-rozdroze-krukow-b-iext172758687.jpg', '/book1', '2024-12-22 14:39:44', 35.00, 'Fantazy', 2, NULL),
(7, 'Miecz przeznaczenia. Wiedźmin. Tom 2', 'Sapkowski Andrzej', 'Autor serii o Wiedźminie, Andrzej Sapkowski, jest mistrzem fantasy o światowej klasie. Wiedźmińska saga składa się z wielu opowiadań, a wśród nich z pewnością zainteresują Cię te, które znalazły się w 2. tomie serii. O czym opowiada książka „Miecz przeznaczenia”?', 'https://ecsmedia.pl/cdn-cgi/image/format=webp,width=544,height=544,/c/miecz-przeznaczenia-wiedzmin-tom-2-b-iext161093107.jpg', '/book1', '2024-12-22 14:41:04', 33.00, 'Fantazy', 0, NULL),
(8, 'Ostatnie życzenie. Wiedźmin. Tom 1', 'Sapkowski Andrzej', 'Sięgając po sagę wiedźmińską, masz szansę wkroczyć w fantastyczny świat wykreowany przez Andrzeja Sapkowskiego. W pierwszym tomie sagi pod tytułem „Ostatnie życzenie” poznasz początek historii Geralta z Rivii i wraz z nim wyruszysz w świat przygód.', 'https://ecsmedia.pl/cdn-cgi/image/format=webp,width=544,height=544,/c/ostatnie-zyczenie-wiedzmin-tom-1-b-iext161038682.jpg', '/book1', '2024-12-22 14:42:22', 40.00, 'Fantazy', 0, NULL),
(10, 'Wieża jaskółki. Wiedźmin. Tom 6', 'Sapkowski Andrzej', 'Jesienne Ekwinokcjum tegoż dziwnego roku przyniosło rozmaite znaki na niebie i na ziemi, które jakoweś klęski niechybnie zwiastowały.\n        \'', 'https://ecsmedia.pl/cdn-cgi/image/format=webp,width=544,height=544,/c/wieza-jaskolki-wiedzmin-tom-6-b-iext161087851.jpg', '/book1', '2024-12-22 14:44:00', 45.00, 'Fantazy', 1, NULL),
(11, 'Chrzest ognia. Wiedźmin. Tom 5', 'Sapkowski Andrzej', 'to Geraltowa kompania:Jaskier, trubadur, Milva, Regis i td.', 'https://ecsmedia.pl/cdn-cgi/image/format=webp,width=544,height=544,/c/chrzest-ognia-wiedzmin-tom-5-b-iext146808430.jpg', '/book1', '2024-12-22 14:44:50', 50.00, 'Fantazy', 0, NULL),
(12, 'Krew elfów. Wiedźmin. Tom 3', 'Sapkowski Andrzej', 'Mistrz gatunku fantasy w Polsce – Andrzej Sapkowski – napisał sagę na miarę najlepszych powieści o fantastycznych światach. Głównym bohaterem uczynił on Geralta – wiedźmina, z którym czytelnik może przeżywać fascynujące, ale i niebezpieczne przygody.', 'https://ecsmedia.pl/cdn-cgi/image/format=webp,width=544,height=544,/c/krew-elfow-wiedzmin-tom-3-b-iext146807006.jpg', '/book1', '2024-12-22 14:45:36', 42.00, 'Fantazy', 0, NULL),
(14, 'Gra o tron. Pieśń Lodu i Ognia. Tom 1', 'Martin George R. R.', 'W kolejnej książce fantasy Martina Georgea R. R. przenosimy się w Zachodnie Krainy. Po ośmiu tysiącach lat zapisanej historii widmo wojen i katastrofy nieustannie wisi nad osadami ludzkimi. Zbliża się kolejna zima, lodowate wichry i mrozy wieją z północy, gdzie schroniły się wyparte przez ludzi pradawne rasy i starzy bogowie. Na szczęście dla Zachodniej Krainy wszyscy zbuntowani władcy pokonali szalonego Smoczego Króla, Aerysa Targaryena, zasiadającego na Żelaznym Tronie Zachodnich Krain. Niestety pokonany król pozostawił po sobie potomstwo, równie szalone i niebezpieczne jak on sam...', 'https://ecsmedia.pl/cdn-cgi/image/format=webp,width=544,height=544,/c/gra-o-tron-piesn-lodu-i-ognia-tom-1-b-iext171289236.jpg', '/book1', '2024-12-22 14:52:15', 44.00, 'Fantazy', 0, NULL),
(15, 'Nic mnie nie złamie. Zapanuj nad swoim umysłem i pokonaj przeciwności losu', 'Goggins David', 'Ponad 4 miliony sprzedanych egzemplarzy na świecie\n\n\"David Goggins jest człowiekiem o żelaznej woli i inspiracją dla wszystkich. Samo słuchanie tego faceta sprawia, że chce się wbiec na jakąś górę. Jestem przekonany, że ludzie tacy jak on mogą zmieniać losy świata. Dzięki nim zaczynamy działać z determinacją i głęboką wiarą w siebie we wszystkim, co robimy. Jego cel, by stać się niezwykłym wśród niezwykłych, to idea, którą może wykorzystać każdy z nas, by odnaleźć w sobie siłę i w pełni wykorzystać swój potencjał. Spotkanie z nim sprawiło, że stałem się lepszym człowiekiem.\"\nJoe Rogan, stand-uper oraz twórca podcastu Joe Rogan Experience.', 'https://ecsmedia.pl/cdn-cgi/image/format=webp,width=544,height=544,/c/nic-mnie-nie-zlamie-zapanuj-nad-swoim-umyslem-i-pokonaj-przeciwnosci-losu-b-iext172232004.jpg', '/book1', '2025-01-06 13:58:22', 49.00, 'Rozwój osobisty', 0, NULL),
(16, 'Red Shirt', 'Popiel Julia', 'Wraz z rozpoczęciem drugiego roku studiów spokojne życie Blake Howard niespodziewanie wywraca się do góry nogami. Przez nieprzyjemne doświadczenia ze współlokatorką dziewczyna musi wyprowadzić się z akademika.\nJej starszy brat, Callum, proponuje, by zamieszkała z nim oraz dwoma jego najlepszymi przyjaciółmi będącymi popularnymi członkami uniwersyteckiej drużyny hokejowej.\nJednym z nich jest Hayden McCarthy, utalentowany bramkarz Hoosiers, znany na kampusie z wybuchowego charakteru oraz lekkiego podejścia do relacji z kobietami. Blake kojarzy chłopaka tylko dlatego, że kiedy poznali się rok temu, sprawił jej przykrość nieprzemyślanymi słowami. Nie ma pojęcia, że on już wtedy zwrócił na nią uwagę.\nWkrótce Blake i Hayden orientują się, że są jedynymi osobami znającymi największy sekret Calluma. Czy wspólna tajemnica ich do siebie zbliży?\nKsiążka zawiera treści nieodpowiednie dla osób poniżej szesnastego roku życia.                 ', 'https://ecsmedia.pl/cdn-cgi/image/format=webp,width=544,height=544,/c/red-shirt-b-iext170634165.jpg', '/book1', '2025-01-06 14:01:07', 33.99, 'Powieść science-fiction.', 0, NULL),
(17, 'The Science of Temptation', 'Popiel Julia', 'Briana Larsen właśnie rozpoczęła kolejny rok nauki na Uniwersytecie Indiana. Kiedy pojawia się na wykładzie z psychopatologii – przedmiotu, który uchodzi za najtrudniejszy na całym kierunku – okazuje się, że za sprawą nowego profesora pierwszy semestr studiów magisterskich będzie dla niej trudniejszy, niż się spodziewała.\n\nReed Easton wygląda tak, jakby przysłał go z piekła sam diabeł. Już na samym początku daje studentom do zrozumienia, że jeżeli nie będą postępować zgodnie z jego zasadami, na sali wykładowej pozostaną po nich jedynie puste miejsca. Z każdym wykładem niechęć Briany do bezwzględnego profesora przybiera na sile. Jednak wszystko zmienia się pewnej nocy, gdy mężczyzna niespodziewanie pojawia się w klubie, w którym dziewczyna pracuje jako barmanka.  Reed nie rozpoznaje swojej studentki i staje w jej obronie przed natarczywym klientem. A później, za sprawą podjętej pod wpływem chwili decyzji, wszystko komplikuje się jeszcze bardziej.\n\nKsiążka zawiera treści nieodpowiednie dla osób poniżej osiemnastego roku życia.', 'https://ecsmedia.pl/cdn-cgi/image/format=webp,width=544,height=544,/c/the-science-of-temptation-b-iext159409587.jpg', '/book1', '2025-01-06 14:02:25', 44.99, 'Współczesny romans', 0, NULL),
(18, 'Bride', 'Ali Hazelwood', 'Wampirzyca i wilkołak zawierają niebezpieczny związek.\nZ tego małżeństwa wynikną same problemy.\nZ nią będą same problemy.\nW świecie zamieszkanym przez wampiry, wilkołaki i ludzi od zawsze trwa wojna. Sarkastyczna Misery Lark, jedyna córka wpływowego wampirzego polityka, ma pogodzić wrogie klany wampirów i wilkołaków. Ceną za pokój na świecie jest jej aranżowane małżeństwo z dość gburowatym i nieprzewidywalnym wilkołakiem.\nLowe Moreland, wilkołak alfa, nie patyczkuje się ze swoim stadem. Jest bezwzględny, ale przynajmniej sprawiedliwy. I do tego ma uczucia. W przeciwieństwie do niektórych wampirów.\nOd razu widać, że nie ufa Misery.\nGdyby tylko wiedział, jak bardzo instynkt go nie myli!\nMisery ma własne powody, by przystać na to małżeństwo z rozsądku. Powody, które nie mają nic wspólnego z polityką czy sojuszami.\nKiedyś kogoś straciła. Teraz gotowa jest zrobić wszystko, aby odzyskać tę osobę. Zniesie nawet Lowa, mimo że jedyne, co ją łączy z wilkołakiem, to wielowiekowa, międzygatunkowa nienawiść.', 'https://ecsmedia.pl/cdn-cgi/image/format=webp,width=544,height=544,/c/bride-b-iext169004423.jpg', '/book1', '2025-01-06 14:04:32', 29.99, 'Historyczne powieści romantyczne', 0, 22.00),
(19, 'Biuro Ludzi Zagubionych', 'Gajewska Zuzanna', 'Klara prowadzi przytulną kawiarnię w Gdańsku. Każdego dnia aromatem kawy zwabia mieszkańców i turystów, a szumem ekspresu zagłusza tęsknotę za bratem bliźniakiem i więzią z matką.\nLokal mieści się przy urokliwej uliczce Kaletniczej i nosi nazwę Biuro Ludzi Zagubionych, bo kiedy kawiarnia była jeszcze pierogarnią, a Klara kelnerką, ciągle ktoś tu zachodził i pytał o drogę. Wtedy rysowała ludziom mapki na serwetkach, a w jej głowie powstawał pomysł na kawiarnię pod nowym szyldem.\nTo właśnie ten szyld przywiódł do niej staruszkę, która wiedziała o sobie tylko tyle, że się zgubiła. Tajemnicze odnalezienie się starszej pani zapoczątkowało podobne przypadki.\nCzy jednak bliscy są gotowi na to, by odzyskać tych, których nie było? Czy na pewno ich szukali? Kto tu tak naprawdę jest zagubiony i jak w tym wszystkim odnajduje się Klara?\n\"Biuro Ludzi Zagubionych\" to powieść z elementami realizmu magicznego, baśń dla dorosłych o poszukiwaniu bliskich, odzyskiwaniu utraconych relacji – i o tym, że najtrudniej odnaleźć samego siebie.', 'https://ecsmedia.pl/cdn-cgi/image/format=webp,width=544,height=544,/c/biuro-ludzi-zagubionych-b-iext174241664.jpg', '/book1', '2025-01-06 14:05:43', 41.50, 'powieść z elementami realizmu magicznego', 0, 32.99),
(20, 'Tajemnice arabskich szpitali. Tom 1', 'Margielewski Marcin', 'Życie Saudyjki można ratować tylko wtedy, gdy jest to zgodne z islamskimi zasadami.\nWedług nowego prawa Saudyjki mogą już same chodzić do lekarza, ale zgodnie ze starym – wciąż obowiązującym – mąż może im zakazać wyjścia z domu. Prawo nie zabrania już ratowania życia kobiecie przez mężczyznę, jeśli wymaga to dotknięcia jej piersi, ale nadal bywa to uznawane za kontakt seksualny. Lekarz mężczyzna nie może przeprowadzić badania ginekologicznego, bo zdaniem islamskich duchownych i konserwatywnych wiernych jest to „haram” – zakazane.\nPrzez dekady obwarowana zakazami religijnymi opieka medyczna dla kobiet praktycznie nie istniała, ale współczesne Saudyjki nie godzą się na to, by mężczyźni odbierali im szanse na zdrowie, a bardzo często nawet na życie. To dlatego pracuje tu coraz więcej lekarek.\nGinekolożki z Europy są w Arabii Saudyjskiej niezwykle poważane. Jedną z nich jest Polka, Sara – bohaterka tej fascynującej, wielowątkowej opowieści o życiu w pustynnym królestwie, w którym zew nowoczesności próbuje się przebić przez wrzask islamskich fundamentalistów.', 'https://ecsmedia.pl/cdn-cgi/image/format=webp,width=544,height=544,/c/tajemnice-arabskich-szpitali-tom-1-b-iext173039423.jpg', '/book1', '2025-01-06 14:07:06', 33.00, 'romans', 1, NULL),
(21, 'Pani Jeziora. Wiedźmin. Tom 7', 'Sapkowski Andrzej', 'Ciri wpatruje się w wypukły relief przedstawiający ogromnego łuskowatego węża. Gad, zwinąwszy się w kształt ósemki, wgryzł się zębiskami we własny ogon. To pradawny wąż Uroboros.', 'https://ecsmedia.pl/cdn-cgi/image/format=webp,width=544,height=544,/c/pani-jeziora-wiedzmin-tom-7-b-iext161092730.jpg', '/book1', '2025-01-06 14:10:55', 35.00, 'Fantazy', 2, 25.00);

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `book_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `book_id`) VALUES
(30, 6, 5),
(31, 6, 6);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `isAdmin` tinyint(1) DEFAULT 0,
  `phone` varchar(15) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `avatar_path` varchar(150) NOT NULL DEFAULT 'uploadsavatar.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `name`, `lastname`, `email`, `password`, `isAdmin`, `phone`, `address`, `avatar_path`) VALUES
(6, 'Heorhi', 'Halavach', 'nierandom@gmail.com', '$2b$10$zcMzNhDfuT/WHwMnQGv1wuYSeCGpd1I0Z.jRsSDbWuAEWVmZqjlLS', 1, '445133350', 'Politechika 2', 'uploads\\1739791365416.png'),
(7, 'nazar', 'lypka', 'random@gmail.com', '$2b$10$9BpwRNd0lyTAUVK.wKMymufUv/bjCrrxiYt3UlhAi.kteoYG1yVs.', 0, NULL, NULL, 'uploads/avatar.png'),
(8, 'Kirill', 'Klimovich', 'kirill@gmail.com', '$2b$10$wyFxI1mwLSPy/.UcDSmS8.NEf9NIo8Rf36rhsIg3zmWikg1CuuvvO', 0, NULL, NULL, 'uploads/avatar.png'),
(12, 'Lesha', 'Mackevich', 'Lesha@gmail.com', '$2b$10$OcKRtJQyGQeSGSW9vgmDA.3K/eQSbLHR4f7d/.fgklHJxgQSpr8pC', 0, NULL, NULL, 'uploads/avatar.png'),
(15, 'Geo', 'Golovach', 'Geo@gmail.com', '$2b$10$CzD7JSOTLD6gBRWf4Dm3SuM7mY2Bo0ffULzK.hErg9/5PZG2PtO2m', 0, NULL, NULL, 'uploads/avatar.png'),
(16, 'Ilya', 'Bezruchenko', 'dibil228@gmail.com', '$2b$10$sWQ88lw5v5GUfptdXGuQ8.Ie2JtIXxRqsVTVhZMXIZdZ2nwGt6/KO', 0, NULL, NULL, 'uploads/avatar.png');

-- --------------------------------------------------------

--
-- Структура таблицы `wishlist`
--

CREATE TABLE `wishlist` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `wishlist`
--

INSERT INTO `wishlist` (`id`, `user_id`, `book_id`) VALUES
(43, 6, 5),
(44, 6, 7);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `book_id` (`book_id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Индексы таблицы `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT для таблицы `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT для таблицы `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
