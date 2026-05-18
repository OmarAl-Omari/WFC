class Cell {
  constructor(num, index) {
    this.collapsed = false;
    this.options = [...Array(num).keys()];
    this.index = index;
  }

  // Collapse to one random allowed option or just randomly if no allowedOptions passed
  collapse() {
    this.collapsed = true;
    let pick = random(this.options);
    this.options = [pick];
  }

}
