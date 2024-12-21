class Book {
    constructor(name, author, description, imageUrl, link) {
        this.name = name;
        this.author = author;
        this.description = description;
        this.imageUrl = imageUrl;
        this.link = link;
    }
}

const books = [
    new Book('Dziewczyna, która prześcignęła czas',
        'Anna Benning',
        'Trylogia „Vortex” Anny Benning to niesamowita podróż przez całkowicie nowe uniwersum.',
        'https://s.lubimyczytac.pl/upload/books/4997000/4997961/952056-352x500.jpg',
        '/book1'
    ),
    new Book(
        'Wiedźmin. Rozdroże kruków',
        'Sapkowski Andrzej',
        'Trylogia „Vortex” Anny Benning to niesamowita podróż przez całkowicie nowe uniwersum.',
        'https://ecsmedia.pl/cdn-cgi/image/format=webp,width=544,height=544,/c/wiedzmin-rozdroze-krukow-b-iext172758687.jpg',
        '/book1'
    ),
    new Book(
        'Miecz przeznaczenia. Wiedźmin. Tom 2',
        'Sapkowski Andrzej',
        'Autor serii o Wiedźminie, Andrzej Sapkowski, jest mistrzem fantasy o światowej klasie. Wiedźmińska saga składa się z wielu opowiadań, a wśród nich z pewnością zainteresują Cię te, które znalazły się w 2. tomie serii. O czym opowiada książka „Miecz przeznaczenia”?',
        'https://ecsmedia.pl/cdn-cgi/image/format=webp,width=544,height=544,/c/miecz-przeznaczenia-wiedzmin-tom-2-b-iext161093107.jpg',
        '/book1'
    ),
    new Book(
        'Ostatnie życzenie. Wiedźmin. Tom 1',
        'Sapkowski Andrzej',
        'Sięgając po sagę wiedźmińską, masz szansę wkroczyć w fantastyczny świat wykreowany przez Andrzeja Sapkowskiego. W pierwszym tomie sagi pod tytułem „Ostatnie życzenie” poznasz początek historii Geralta z Rivii i wraz z nim wyruszysz w świat przygód.',
        'https://ecsmedia.pl/cdn-cgi/image/format=webp,width=544,height=544,/c/ostatnie-zyczenie-wiedzmin-tom-1-b-iext161038682.jpg',
        '/book1'
    ),
    new Book(
        'Pani Jeziora. Wiedźmin. Tom 7',
        'Sapkowski Andrzej',
        'Ciri wpatruje się w wypukły relief przedstawiający ogromnego łuskowatego węża. Gad, zwinąwszy się w kształt ósemki, wgryzł się zębiskami we własny ogon. To pradawny wąż Uroboros.',
        'https://ecsmedia.pl/cdn-cgi/image/format=webp,width=544,height=544,/c/pani-jeziora-wiedzmin-tom-7-b-iext161092730.jpg',
        '/book1'
    ),
    new Book(
        'Wieża jaskółki. Wiedźmin. Tom 6',
        'Sapkowski Andrzej',
        'Jesienne Ekwinokcjum tegoż dziwnego roku przyniosło rozmaite znaki na niebie i na ziemi, które jakoweś klęski niechybnie zwiastowały.',
        'https://ecsmedia.pl/cdn-cgi/image/format=webp,width=544,height=544,/c/wieza-jaskolki-wiedzmin-tom-6-b-iext161087851.jpg',
        '/book1'
    ),
    new Book(
        'Chrzest ognia. Wiedźmin. Tom 5',
        'Sapkowski Andrzej',
        'to Geraltowa kompania:Jaskier, trubadur, Milva, Regis i td',
        'https://ecsmedia.pl/cdn-cgi/image/format=webp,width=544,height=544,/c/chrzest-ognia-wiedzmin-tom-5-b-iext146808430.jpg',
        '/book1'
    ),
    new Book(
        'Krew elfów. Wiedźmin. Tom 3',
        'Sapkowski Andrzej',
        'Mistrz gatunku fantasy w Polsce – Andrzej Sapkowski – napisał sagę na miarę najlepszych powieści o fantastycznych światach. Głównym bohaterem uczynił on Geralta – wiedźmina, z którym czytelnik może przeżywać fascynujące, ale i niebezpieczne przygody.',
        'https://ecsmedia.pl/cdn-cgi/image/format=webp,width=544,height=544,/c/krew-elfow-wiedzmin-tom-3-b-iext146807006.jpg',
        '/book1'
    ),
    new Book(
        'Gra o tron. Pieśń Lodu i Ognia. Tom 1',
        'Martin George R. R.',
        'W kolejnej książce fantasy Martina Georgea R. R. przenosimy się w Zachodnie Krainy. Po ośmiu tysiącach lat zapisanej historii widmo wojen i katastrofy nieustannie wisi nad osadami ludzkimi. Zbliża się kolejna zima, lodowate wichry i mrozy wieją z północy, gdzie schroniły się wyparte przez ludzi pradawne rasy i starzy bogowie. Na szczęście dla Zachodniej Krainy wszyscy zbuntowani władcy pokonali szalonego Smoczego Króla, Aerysa Targaryena, zasiadającego na Żelaznym Tronie Zachodnich Krain. Niestety pokonany król pozostawił po sobie potomstwo, równie szalone i niebezpieczne jak on sam...',
        'https://ecsmedia.pl/cdn-cgi/image/format=webp,width=544,height=544,/c/gra-o-tron-piesn-lodu-i-ognia-tom-1-b-iext171289236.jpg',
        '/book1'
    ),
];

module.exports = { Book, books };