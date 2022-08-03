const { readFile } = require("fs/promises");

class BaseRepository {
  constructor({ file }) {
    this.file = file;
  }

  async find(itemId) {
    const content = JSON.parse(await readFile(this.file));

    // retorna todo o conteudo caso nao passe id do item
    if (!itemId) return content;

    // retorna apenas o item com id igual
    return content.find(({ id }) => id === itemId);
  }
}

module.exports = BaseRepository;
