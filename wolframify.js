javascript:(window.GRAPH_OF_LIFE = window.GRAPH_OF_LIFE || {
  interval_id: null,
};

var svg = document.getElementsByClassName('js-calendar-graph-svg')[0],
    graph = svg.children[0],
    columns = [].filter.call(graph.children, function(node) { return node.tagName === 'g'; }),
    grid = create_grid_from_columns(columns);

hide_edge_columns(columns);

if (window.GRAPH_OF_LIFE.interval_id) {
  clearInterval(window.GRAPH_OF_LIFE.interval_id);
  window.GRAPH_OF_LIFE.interval_id = null;
} else {
  window.GRAPH_OF_LIFE.interval_id = setInterval(life_iteration, 500);
}

function create_grid_from_columns(svg_columns) {
  /* ignore first and last cols, since they might be different heights */
  return [].map.call(svg_columns.slice(1, svg_columns.length - 1), function(col) {
    return [].map.call(col.children, function(node) {
      var value = Math.floor(1 + Math.random() * 2);
      return new Cell(value, node);
    });
  });
}

function hide_edge_columns(svg_columns) {
  function color_white(svg_node) { svg_node.setAttribute('fill', '#ffffff'); }
  [].forEach.call(svg_columns[0].children, color_white);
  [].forEach.call(svg_columns[svg_columns.length-1].children, color_white);
}

function life_iteration() {
  /* iterate over full grid twice, first to count neighbors, then to apply Life rules */
  grid.forEach(function(column, x) {
    column.forEach(function(cell, y) {
      cell.next_value = get_new_cell_value(x, y);
    });
  });

  grid.forEach(function(column, x) {
    column.forEach(function(cell, y) {
      cell.apply_life_rules();
    });
  });
}

function get_new_cell_value(x, y) {
  var neighbs = 0,
      positions = [[x-1,y-1], [x-0,y-1], [x+1,y-1],
                   [x-1,y-0], /* ^_^  */ [x+1,y-0],
                   [x-1,y+1], [x-0,y+1], [x+1,y+1]];
  
  var count = [0, 0, 0, 0, 0];

  positions.forEach(function(point) {
    var x = point[0], y = point[1];

    if (x < 0 ||
        y < 0 ||
        x > grid.length - 1 ||
        y > grid[0].length - 1) return;

    count[grid[x][y].current_value]++;
  });

  switch(grid[x][y].current_value)
  {
  	case 0:
    	if ([3, 5, 7].indexOf(count[1]) !== -1)
      	return 1;
      return 0;
    case 1:
    	if ([3, 4, 5, 7].indexOf(count[1]) !== -1)
      	return 1;
      return 2;
    case 2:
    	return 3;
    case 3:
    	return 4;
    // catches 4 too.
    default:
   		return 0;
  }
}

function Cell(value, svg_el_reference) {
  this.svg_el_reference = svg_el_reference || null;
  this.next_value = 0;
  this.current_value = value;
}

Cell.prototype.apply_life_rules = function() {
  this.current_value = this.next_value;
  var greens = ['#eeeeee', '#d6e685', '#8cc665', '#44a340', '#1e6823'],
      green = greens[this.current_value];
  this.svg_el_reference.setAttribute('fill', green);
})();
