class Tile {
  constructor(img, edges) {
    this.img = img;
    this.edges = edges; // [top, right, bottom, left]
    this.north = [];
    this.east = [];
    this.south = [];
    this.west = [];
  }
  checkReverse(a,b){
    return a === b.split("").reverse().join("");
  }
  analyzeCompatibility(tiles) {
    for (let i = 0; i < tiles.length; i++) {
      const other = tiles[i];
      if (this.checkReverse(this.edges[0], other.edges[2])) this.north.push(i);
      if (this.checkReverse(this.edges[1], other.edges[3])) this.east.push(i);
      if (this.checkReverse(this.edges[2], other.edges[0])) this.south.push(i);
      if (this.checkReverse(this.edges[3], other.edges[1])) this.west.push(i);
    }
  }
}
