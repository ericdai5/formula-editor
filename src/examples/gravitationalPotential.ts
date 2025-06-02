// Gravitational Potential Energy example formula code
const gravitationalPotentialExample = `// Formulize configuration - Gravitational Potential Energy Example
// This JavaScript code is directly executed by the Formulize API

const config = {
  formula: {
    expression: "U = mgh",
    variables: {
      U: {
        type: "dependent",
        units: "J",
        label: "Potential Energy",
        precision: 2
      },
      m: {
        type: "input",
        value: 1,
        range: [0.1, 100],
        units: "kg",
        label: "Mass"
      },
      g: {
        type: "input",
        value: 9.8,
        range: [1, 20],
        units: "m/s²",
        label: "Gravity"
      },
      h: {
        type: "input",
        value: 10,
        range: [0, 1000],
        units: "m",
        label: "Height"
      }
    },
    computation: {
      engine: "symbolic-algebra",
      formula: "{U} = {m} * {g} * {h}"
    }
  },
  
  visualizations: [
    {
      type: "plot2d",
      id: "potentialEnergyPlot",
      config: {
        title: "Potential Energy vs. Height",
        xAxis: {
          variable: "h",
          label: "Height (m)",
          min: 0,
          max: 100
        },
        yAxis: {
          variable: "U",
          label: "Potential Energy (J)",
          min: 0,
          max: 10000
        },
        width: 800,
        height: 500
      }
    }
  ]
};

// Create the Formulize instance with the configuration
const formula = await Formulize.create(config);`;

export default gravitationalPotentialExample;
