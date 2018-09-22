import * as d3 from 'd3'

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 20
}

const width = 700 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const svg = d3
  .select('#bar-chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3.scaleBand().range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .domain(['Asia', 'Africa', 'Europe', 'N. America', 'S. America'])
  .range(['#3E606F', '#193441', '#F1E4B3', '#D1DBBD', '#FF8859'])

d3.csv(require('./countries.csv')).then(ready)

function ready(datapoints) {
  // Sort the countries from low to high
  datapoints = datapoints.sort((a, b) => {
    return a.life_expectancy - b.life_expectancy
  })

  // And set up the domain of the xPositionScale
  // using the read-in data
  const countries = datapoints.map(d => d.country)
  xPositionScale.domain(countries)

  d3.select('#asia').on('click', () => {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.continent === 'Asia') {
        return '#3E606F'
      } else {
        return '#91AA9D'
      }
    })
  })

  d3.select('#africa').on('click', () => {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.continent === 'Africa') {
        return '#193441'
      } else {
        return '#91AA9D'
      }
    })
  })

  d3.select('#north-america').on('click', () => {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.continent === 'N. America') {
        return '#D1DBBD'
      } else {
        return '#91AA9D'
      }
    })
  })

  d3.select('#low-gdp').on('click', () => {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.gdp_per_capita < 4000) {
        return '#AA7271'
      } else {
        return '#91AA9D'
      }
    })
  })

  d3.select('#color').on('click', () => {
    svg.selectAll('rect').attr('fill', function(d) {
      return colorScale(d.continent)
    })
  })

  d3.select('#reset').on('click', () => {
    svg.selectAll('rect').attr('fill', '#91AA9D')
  })

  /* Add your rectangles here */
  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('width', width / 188)
    .attr('height', d => {
      return height - yPositionScale(d.life_expectancy)
    })
    .attr('x', d => {
      return xPositionScale(d.country)
    })
    .attr('y', d => {
      return yPositionScale(d.life_expectancy)
    })
    .attr('fill', '#91AA9D')

    .on('mouseover', function(d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('opacity', 0.5)

      // These won't display because they're hidden in the html/ CSS
      d3.select('#name').text(d.country)
    })

    .on('mouseout', function(d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('opacity', 1)
    })

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(-width)
    .ticks(5)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  d3.select('.y-axis .domain').remove()
}
