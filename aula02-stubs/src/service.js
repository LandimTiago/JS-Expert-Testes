const https = require("https");

class Service {
  async makeRequest(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (response) => {
        response.on("data", (data) => resolve(JSON.parse(data))); // quando tiver data chama o resolve
        response.on("error", reject); // quando não tiver data chama o rejects
      });
    });
  }

  async getPlanets(url) {
    const result = await this.makeRequest(url);
    return {
      name: result.name,
      surfaceWater: result.surface_water,
      appearedIn: result.films.length,
    };
  }
}

module.exports = Service;
