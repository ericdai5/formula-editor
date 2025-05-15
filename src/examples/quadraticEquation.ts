// Quadratic Equation example formula code
const quadraticEquationExample = `// Formulize configuration - Quadratic Equation Example
// This JavaScript code is directly executed by the Formulize API

const config = {
  formula: {
    expression: "y = ax^2 + bx + c",
    variables: {
      y: {
        type: "dependent",
        label: "y-value",
        precision: 2
      },
      x: {
        type: "input",
        value: 0,
        range: [-10, 10],
        step: 0.1,
        label: "x"
      },
      a: {
        type: "input",
        value: 1,
        range: [-5, 5],
        step: 0.1,
        label: "Coefficient a"
      },
      b: {
        type: "input",
        value: 0,
        range: [-10, 10],
        step: 0.1,
        label: "Coefficient b"
      },
      c: {
        type: "input",
        value: 0,
        range: [-10, 10],
        step: 0.1,
        label: "Coefficient c"
      }
    },
    computation: {
      engine: "symbolic-algebra",
      formula: "{y} = {a} * {x} * {x} + {b} * {x} + {c}"
    }
  },
  
  visualizations: [
    {
      type: "plot2d",
      id: "quadraticPlot",
      config: {
        title: "Quadratic Function",
        xAxis: {
          variable: "x",
          label: "x",
          min: -5,
          max: 5
        },
        yAxis: {
          variable: "y",
          label: "y",
          min: -10,
          max: 10
        },
        width: 800,
        height: 500
      }
    }
  ],
  
  bindings: [
    {
      source: { component: "quadraticPlot", property: "points[0].x" },
      target: { component: "formula", property: "x" },
      direction: "bidirectional"
    }
  ]
};

// Create the Formulize instance with the configuration
const formula = await Formulize.create(config);`;

export default quadraticEquationExample;
