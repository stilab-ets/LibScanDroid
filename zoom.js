var win = window,
  doc = document,
  docElem = doc.documentElement,
  body = doc.getElementsByTagName("body")[0],
  x = win.innerWidth || docElem.clientWidth || body.clientWidth,
  y = win.innerHeight || docElem.clientHeight || body.clientHeight;

var width = x * 0.6;
var height = x * 0.6;
console.log(width);

//Create SVG element
var svg = d3
  .select(".myBox")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "svg");

// var svg = d3.select("svg");
margin = 20;
diameter = +svg.attr("width");
g = svg
  .append("g")
  .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

var color = d3
  .scaleLinear()
  .domain([-1, 5])
  .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
  .interpolate(d3.interpolateHcl);

var pack = d3
  .pack()
  .size([diameter - margin, diameter - margin])
  .padding(2);

var select = document.getElementById("selection");
var fileselected = filename();
d3.json(fileselected + ".json", function (error, root) {
  if (error) throw error;

  root = d3
    .hierarchy(root)
    .sum(function (d) {
      return d.value;
    })
    .sort(function (a, b) {
      return b.value - a.value;
    });

  var focus = root,
    nodes = pack(root).descendants();
  // view;

  var circle = g
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", function (d) {
      return d.parent
        ? d.children
          ? "node"
          : "node node--leaf"
        : "node node--root";
    })
    .style("fill", function (d) {
      return d.children ? color(d.depth) : null;
    })
    .on("click", function (d) {
      if (focus !== d) zoom(d), d3.event.stopPropagation();
    });

  var text = g
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", "label")
    .style("fill-opacity", function (d) {
      return d.parent === root ? 1 : 1;
    })
    .style("display", function (d) {
      return d.parent === root ? "inline" : "inline";
    })
    // .style('fill', 'red')
    // .style('fill',function(d){if(d.data.name =='print-1.0.0'){return 'red'}})
    .text(function (d) {
      return d.data.name;
    });

  // .size(function(d) { if(d.data.name =='print-1.0.0') {return 120;} })

  var node = g.selectAll("circle,text");

  svg.style("background", color(0)).on("click", function () {
    zoom(root);
  });

  zoomTo([root.x, root.y, root.r * 2 + margin]);

  function zoom(d) {
    var focus0 = focus;
    focus = d;

    var transition = d3
      .transition()
      .duration(d3.event.altKey ? 7500 : 750)
      .tween("zoom", function (d) {
        var i = d3.interpolateZoom(view, [
          focus.x,
          focus.y,
          focus.r * 2 + margin,
        ]);
        return function (t) {
          zoomTo(i(t));
        };
      });

    transition
      .selectAll("text")
      .filter(function (d) {
        return d.parent === focus || this.style.display === "inline";
      })
      .style("fill-opacity", function (d) {
        return d.parent === focus ? 1 : 1;
      })
      .on("start", function (d) {
        if (d.parent === focus) this.style.display = "inline";
      })
      .on("end", function (d) {
        if (d.parent !== focus) this.style.display = "inline";
      });
  }

  function zoomTo(v) {
    var k = diameter / v[2];
    view = v;
    node.attr("transform", function (d) {
      return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
    });
    circle.attr("r", function (d) {
      return d.r * k;
    });
  }
});

function update() {
  // location.reload();
  d3.selectAll("svg").remove();
  // svg.remove()

  //Create SVG element
  var svg = d3
    .select(".myBox")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "svg");

  // var svg = d3.select("svg");

  // var svg = d3.select("svg");
  margin = 20;
  diameter = +svg.attr("width");
  g = svg
    .append("g")
    .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

  var select = document.getElementById("selection");
  var fileselected = filename();
  d3.json(fileselected + ".json", function (error, root) {
    if (error) throw error;

    root = d3
      .hierarchy(root)
      .sum(function (d) {
        return d.value;
      })
      .sort(function (a, b) {
        return b.value - a.value;
      });

    var focus = root,
      nodes = pack(root).descendants();
    // view;

    var circle = g
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("class", function (d) {
        return d.parent
          ? d.children
            ? "node"
            : "node node--leaf"
          : "node node--root";
      })
      .style("fill", function (d) {
        return d.children ? color(d.depth) : null;
      })
      .on("click", function (d) {
        if (focus !== d) zoom(d), d3.event.stopPropagation();
      });

    var text = g
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("class", "label")
      .style("fill-opacity", function (d) {
        return d.parent === root ? 1 : 1;
      })
      .style("display", function (d) {
        return d.parent === root ? "inline" : "inline";
      })
      .text(function (d) {
        return d.data.name;
      });

    // .size(function(d) { if(d.data.name =='print-1.0.0') {return 120;} })

    var node = g.selectAll("circle,text");

    svg.style("background", color(0)).on("click", function () {
      zoom(root);
    });

    zoomTo([root.x, root.y, root.r * 2 + margin]);

    function zoom(d) {
      var focus0 = focus;
      focus = d;

      var transition = d3
        .transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function (d) {
          var i = d3.interpolateZoom(view, [
            focus.x,
            focus.y,
            focus.r * 2 + margin,
          ]);
          return function (t) {
            zoomTo(i(t));
          };
        });

      transition
        .selectAll("text")
        .filter(function (d) {
          return d.parent === focus || this.style.display === "inline";
        })
        .style("fill-opacity", function (d) {
          return d.parent === focus ? 1 : 1;
        })
        .on("start", function (d) {
          if (d.parent === focus) this.style.display = "inline";
        })
        .on("end", function (d) {
          if (d.parent !== focus) this.style.display = "inline";
        });
    }

    function zoomTo(v) {
      var k = diameter / v[2];
      view = v;
      node.attr("transform", function (d) {
        return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
      });
      circle.attr("r", function (d) {
        return d.r * k;
      });
    }
  });
}

function checkInput() {
  var query = document.getElementById("search").value;
  console.log(query);
  window.find(query);
  console.log(window.find(query));

  if (query !== "") {
    // location.reload();
    d3.selectAll("svg").remove();
    // svg.remove()

    //Create SVG element
    var svg = d3
      .select(".myBox")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "svg");

    // var svg = d3.select("svg");

    // var svg = d3.select("svg");
    margin = 20;
    diameter = +svg.attr("width");
    g = svg
      .append("g")
      .attr(
        "transform",
        "translate(" + diameter / 2 + "," + diameter / 2 + ")"
      );

    var select = document.getElementById("selection");
    var fileselected = filename();
    d3.json(fileselected + ".json", function (error, root) {
      if (error) throw error;

      root = d3
        .hierarchy(root)
        .sum(function (d) {
          return d.value;
        })
        .sort(function (a, b) {
          return b.value - a.value;
        });

      var focus = root,
        nodes = pack(root).descendants();
      // view;

      var circle = g
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", function (d) {
          return d.parent
            ? d.children
              ? "node"
              : "node node--leaf"
            : "node node--root";
        })
        .style("fill", function (d) {
          return d.children ? color(d.depth) : null;
        })
        .on("click", function (d) {
          if (focus !== d) zoom(d), d3.event.stopPropagation();
        });

      var text = g
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("class", "label")
        .style("fill-opacity", function (d) {
          return d.parent === root ? 1 : 1;
        })
        .style("display", function (d) {
          return d.parent === root ? "inline" : "inline";
        })
        .style("fill", function (d) {
          if (d.data.name.includes(query, 0)) {
            if (d.data.name == query) {
              return "green";
            } else {
              return "red";
            }
          }
        })
        .style("font-size", function (d) {
          if (d.data.name.includes(query, 0)) {
            return "15px";
          }
        })
        .attr("id", function (d) {
          if (d.data.name.includes(query, 0)) {
            return "selectedstyle";
          }
        })
        .text(function (d) {
          return d.data.name;
        });

      // .size(function(d) { if(d.data.name =='print-1.0.0') {return 120;} })

      var node = g.selectAll("circle,text");

      svg.style("background", color(0)).on("click", function () {
        zoom(root);
      });

      zoomTo([root.x, root.y, root.r * 2 + margin]);

      function zoom(d) {
        var focus0 = focus;
        focus = d;

        var transition = d3
          .transition()
          .duration(d3.event.altKey ? 7500 : 750)
          .tween("zoom", function (d) {
            var i = d3.interpolateZoom(view, [
              focus.x,
              focus.y,
              focus.r * 2 + margin,
            ]);
            return function (t) {
              zoomTo(i(t));
            };
          });

        transition
          .selectAll("text")
          .filter(function (d) {
            return d.parent === focus || this.style.display === "inline";
          })
          .style("fill-opacity", function (d) {
            return d.parent === focus ? 1 : 1;
          })
          .on("start", function (d) {
            if (d.parent === focus) this.style.display = "inline";
          })
          .on("end", function (d) {
            if (d.parent !== focus) this.style.display = "inline";
          });
      }

      function zoomTo(v) {
        var k = diameter / v[2];
        view = v;
        node.attr("transform", function (d) {
          return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
        });
        circle.attr("r", function (d) {
          return d.r * k;
        });
      }
    });
  }
}

function filename() {
  console.log(output2.innerHTML);
  console.log(output.innerHTML);
  console.log(output1.innerHTML);

  console.log(
    "DatamaxEpsilon" +
      output.innerHTML +
      "epsilonStep" +
      output2.innerHTML +
      "minpoint" +
      output1.innerHTML
  );
  return (
    "data/" +
    "DatamaxEpsilon" +
    output.innerHTML +
    "epsilonStep" +
    output2.innerHTML +
    "minpoint" +
    output1.innerHTML
  );
}

function fileInput(listlib) {
  // var query = document.getElementById('search').value;
  // console.log(query);
  // window.find(query);
  // console.log(window.find(query));

  if (true) {
    // location.reload();
    d3.selectAll("svg").remove();
    // svg.remove()

    //Create SVG element
    var svg = d3
      .select(".myBox")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "svg");

    // var svg = d3.select("svg");

    // var svg = d3.select("svg");
    margin = 20;
    diameter = +svg.attr("width");
    g = svg
      .append("g")
      .attr(
        "transform",
        "translate(" + diameter / 2 + "," + diameter / 2 + ")"
      );

    var select = document.getElementById("selection");
    var fileselected = filename();
    d3.json(fileselected + ".json", function (error, root) {
      if (error) throw error;

      root = d3
        .hierarchy(root)
        .sum(function (d) {
          return d.value;
        })
        .sort(function (a, b) {
          return b.value - a.value;
        });

      var focus = root,
        nodes = pack(root).descendants();
      // view;

      var circle = g
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", function (d) {
          return d.parent
            ? d.children
              ? "node"
              : "node node--leaf"
            : "node node--root";
        })
        .style("fill", function (d) {
          return d.children ? color(d.depth) : null;
        })
        .on("click", function (d) {
          if (focus !== d) zoom(d), d3.event.stopPropagation();
        });

      var text = g
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("class", "label")
        .style("fill-opacity", function (d) {
          return d.parent === root ? 1 : 1;
        })
        .style("display", function (d) {
          return d.parent === root ? "inline" : "inline";
        })
        .style("fill", function (d) {
          if (listlib.length > 0) {
            if (listlib.includes(d.data.name)) {
              return "green";
            }
          }
        })
        .style("font-size", function (d) {
          if (listlib.includes(d.data.name)) {
            return "17px";
          }
        })
        .attr("id", function (d) {
          if (listlib.includes(d.data.name)) {
            return "selectedstyle";
          }
        })
        .text(function (d) {
          return d.data.name;
        });

      var node = g.selectAll("circle,text");

      svg.style("background", color(0)).on("click", function () {
        zoom(root);
      });

      zoomTo([root.x, root.y, root.r * 2 + margin]);

      function zoom(d) {
        var focus0 = focus;
        focus = d;

        var transition = d3
          .transition()
          .duration(d3.event.altKey ? 7500 : 750)
          .tween("zoom", function (d) {
            var i = d3.interpolateZoom(view, [
              focus.x,
              focus.y,
              focus.r * 2 + margin,
            ]);
            return function (t) {
              zoomTo(i(t));
            };
          });

        transition
          .selectAll("text")
          .filter(function (d) {
            return d.parent === focus || this.style.display === "inline";
          })
          .style("fill-opacity", function (d) {
            return d.parent === focus ? 1 : 1;
          })
          .on("start", function (d) {
            if (d.parent === focus) this.style.display = "inline";
          })
          .on("end", function (d) {
            if (d.parent !== focus) this.style.display = "inline";
          });
      }

      function zoomTo(v) {
        var k = diameter / v[2];
        view = v;
        node.attr("transform", function (d) {
          return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
        });
        circle.attr("r", function (d) {
          return d.r * k;
        });
      }
    });
  }
}

function filename() {
  console.log(output2.innerHTML);
  console.log(output.innerHTML);
  console.log(output1.innerHTML);

  console.log(
    "DatamaxEpsilon" +
      output.innerHTML +
      "epsilonStep" +
      output2.innerHTML +
      "minpoint" +
      output1.innerHTML
  );
  return (
    "data/" +
    "DatamaxEpsilon" +
    output.innerHTML +
    "epsilonStep" +
    output2.innerHTML +
    "minpoint" +
    output1.innerHTML
  );
}

// <input type="file" name="file" id="file">

// function readfile(){
//   console.log("changed")
document.getElementById("myfile").onchange = function () {
  var arrayoflib = [];

  var file = this.files[0];

  var reader = new FileReader();
  reader.onload = function (progressEvent) {
    // Entire file
    // console.log(this.result);

    // By lines

    var lines = this.result.split("\n");
    console.log("result", lines);
    for (var line = 0; line < lines.length; line++) {
      arrayoflib.push(lines[line].replace(/(\r\n|\n|\r)/gm, ""));
      console.log(lines[line]);
    }

    fileInput(arrayoflib);
  };
  reader.readAsText(file);
};
