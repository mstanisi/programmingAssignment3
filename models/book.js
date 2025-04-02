const books = [
  {id: "0", title: "Leviathan Wakes", publishingYear: 2011, genreId: "0", authorIds: ["0","1"]},
  {id: "1", title: "Caliban’s War", publishingYear: 2012},
  {id: "2", title: "Abaddon’s Gate", publishingYear: 2013, genreId: "0", authorIds: ["0"]},
  {id: "3", title: "Cibola Burn", publishingYear: 2014, genreId: "0", authorIds: ["0"]},
  {id: "4", title: "Nemesis Games", publishingYear: 2015, genreId: "0", authorIds: ["0"]},
  {id: "5", title: "Babylon’s Ashes", publishingYear: 2016, genreId: "0", authorIds: ["0"]},
  {id: "6", title: "Persepolis Rising", publishingYear: 2017, genreId: "0", authorIds: ["0"]},
  {id: "7", title: "Tiamat’s Wrath", publishingYear: 2018, genreId: "0", authorIds: ["0"]},
  {id: "8", title: "Strange Dogs", publishingYear: 2017, genreId: "0", authorIds: ["0"]}
];

exports.getById = (id) => {
  return books.find(book => book.id === id);
};

exports.all = books

exports.get = (idxOrId) => {
  const byId = books.find(book => book.id === String(idxOrId));
  if (byId) return byId;
  return books[idxOrId];
};

exports.add = (book) => {
  books.push(book);
}

exports.update = (book) => {
  books[book.id] = book;
}

exports.upsert = (book) => {
  if (book.authorIds && ! Array.isArray(book.authorIds)) {
    book.authorIds = [book.authorIds];
  }
  if (book.id) {
    exports.update(book);
  } else {
    exports.add(book);
  }
}