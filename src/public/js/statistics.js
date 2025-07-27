document.addEventListener('DOMContentLoaded', async () => {
  const [postsData, usersData] = await Promise.all([
    fetch('/api/statistics/posts-per-day').then(res => res.json()),
    fetch('/api/statistics/users-per-day').then(res => res.json())
  ]);

  drawBarChart(postsData, '#postsChart');
  drawLineChart(usersData, '#usersChart');
});

function drawBarChart(data, selector) {
  const svg = d3.select(selector);
  const width = +svg.attr('width');
  const height = +svg.attr('height');
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };

  const x = d3.scaleBand()
    .domain(data.map(d => d.date))
    .range([margin.left, width - margin.right])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)]).nice()
    .range([height - margin.bottom, margin.top]);

  svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-40)")
    .style("text-anchor", "end");

  svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  svg.selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', d => x(d.date))
    .attr('y', d => y(d.count))
    .attr('height', d => y(0) - y(d.count))
    .attr('width', x.bandwidth())
    .attr('fill', '#4285f4');
}

function drawLineChart(data, selector) {
  const svg = d3.select(selector);
  const width = +svg.attr('width');
  const height = +svg.attr('height');
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };

  const parseDate = d3.timeParse('%Y-%m-%d');
  data.forEach(d => d.date = parseDate(d.date));

  const x = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)]).nice()
    .range([height - margin.bottom, margin.top]);

  const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.count));

  svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%b %d')));

  svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#34a853')
    .attr('stroke-width', 2)
    .attr('d', line);
}
